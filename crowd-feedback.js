/**
 * crowd-feedback.js - the crowd-model feedback loop.
 *
 * THE RETURN-VISIT PROBLEM, AND HOW THIS SOLVES IT
 * A crowd prediction can only be validated by someone who was at the mountain
 * on the day. Asking people to make a special return trip to report back never
 * works. So this rides visits that happen anyway: a skier who checks us Friday
 * for Saturday tends to check again the next Friday. On that next visit, if a
 * ski day they got a pick for has now passed, we surface one ambient,
 * dismissible line: "You looked at Sunday River for Sat. How packed was it?"
 * with three taps. We spend one second of attention we already have, no special
 * trip required.
 *
 * TWO SIGNALS, DIFFERENT JOBS
 *   1. INTENT (captured at recommendation time, costs nothing): "Going with
 *      this pick?" - validates the recommendation, and tells us which mountain
 *      to ask this person about later.
 *   2. CROWD REALITY (captured on a later visit): "How packed was it?" - the
 *      blunt three-point report that, in aggregate, tells us where the crowd
 *      model is wrong, especially in regions we cannot calibrate by hand.
 *
 * STORAGE
 *   - Local: a small ring buffer in localStorage of recent picks (mountain, ski
 *     day, what we predicted) so we can ask about them later. Anonymous, capped,
 *     self-pruning. No account, no PII.
 *   - Server: each report POSTs to /api/crowd-feedback (fire-and-forget, same
 *     pattern as track-recommendation) which writes a row to Supabase.
 *
 * DELIBERATELY GATED so it never clutters a first-timer's experience:
 *   - Nothing renders for a visitor with no past pending pick.
 *   - The prompt is one tap, dismissible, and never blocks the page.
 *   - Reports are rough (three-point, from memory). That is fine: aggregate
 *     signal from a blunt instrument is what re-anchors the model. We are not
 *     measuring crowds to the person, we are learning that we said "Quiet" and
 *     40 people tapped "Packed".
 *
 * This file is in the obfuscate-scoring.mjs TARGETS list (it reveals nothing
 * sensitive, but stays consistent with the rest of the client bundle).
 */
(function (root) {
  'use strict';

  var LS_KEY        = 'wtsn_feedback_v1';
  var MAX_PENDING   = 12;                 // ring buffer cap
  var DUE_AFTER_MS  = 18 * 60 * 60 * 1000; // ski day must be ~a day past before we ask
  var EXPIRE_MS     = 21 * 24 * 60 * 60 * 1000; // forget unreported picks after 3 weeks
  var ENDPOINT      = '/api/crowd-feedback';

  // ─── Storage helpers (defensive: localStorage can throw in private mode) ────

  function _load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function _save(arr) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr.slice(-MAX_PENDING))); }
    catch (e) {}
  }

  function _sessionId() {
    try {
      var id = sessionStorage.getItem('wsn_session');
      if (!id) { id = Math.random().toString(36).slice(2); sessionStorage.setItem('wsn_session', id); }
      return id;
    } catch (e) { return 'unknown'; }
  }

  function _prune(arr, now) {
    return arr.filter(function (e) {
      if (!e || !e.skiDayMs) return false;
      if (e.reported) return now - e.skiDayMs < EXPIRE_MS ? true : false; // keep reported briefly to dedupe
      return now - e.skiDayMs < EXPIRE_MS; // drop stale unreported
    });
  }

  // ─── 1. Record a pick (called when the verdict surfaces a top pick) ─────────
  // skiDayMs = midnight of the ski day the pick was for. predictedLabel/Score =
  // what the crowd model said, so we can later compare prediction to reality.

  function recordPick(opts) {
    if (!opts || !opts.resortId || !opts.skiDayMs) return;
    var now = Date.now();
    var arr = _prune(_load(), now);

    // De-dupe: one entry per (resort, ski day). Update prediction if re-rendered.
    var key = opts.resortId + '|' + opts.skiDayMs;
    var existing = arr.find(function (e) { return e.key === key; });
    if (existing) {
      existing.predictedLabel = opts.predictedLabel || existing.predictedLabel;
      existing.predictedScore = opts.predictedScore != null ? opts.predictedScore : existing.predictedScore;
      _save(arr);
      return;
    }

    arr.push({
      key:            key,
      resortId:       String(opts.resortId).slice(0, 80),
      resortName:     String(opts.resortName || '').slice(0, 120),
      skiDayMs:       opts.skiDayMs,
      predictedLabel: opts.predictedLabel || '',
      predictedScore: opts.predictedScore != null ? opts.predictedScore : null,
      intent:         null,   // set by recordIntent: 'going' | 'maybe' | 'no'
      reported:       false,  // set true once a crowd report is given
      recordedMs:     now,
    });
    _save(arr);
  }

  // ─── 2. Intent tap (captured at recommendation time, optional, cheap) ───────

  function recordIntent(resortId, skiDayMs, intent) {
    var arr = _load();
    var key = resortId + '|' + skiDayMs;
    var e = arr.find(function (x) { return x.key === key; });
    if (!e) return;
    e.intent = intent;
    _save(arr);
    _post({
      type:           'intent',
      resort_id:      e.resortId,
      resort_name:    e.resortName,
      ski_day:        new Date(e.skiDayMs).toISOString().slice(0, 10),
      predicted_label: e.predictedLabel,
      predicted_score: e.predictedScore,
      intent:         intent,
    });
  }

  // ─── 3. Find a pick that is now due for a crowd report ──────────────────────
  // Returns the most recent past, unreported pick the user actually committed to
  // (intent 'going' preferred), else the most recent past unreported pick.

  function pendingReport() {
    var now = Date.now();
    var arr = _prune(_load(), now);
    _save(arr);
    var due = arr.filter(function (e) {
      return !e.reported && (now - e.skiDayMs) >= DUE_AFTER_MS;
    });
    if (!due.length) return null;
    // Prefer mountains they said they were going to; those reports are most
    // trustworthy. Then most recent ski day.
    due.sort(function (a, b) {
      var ai = a.intent === 'going' ? 1 : 0;
      var bi = b.intent === 'going' ? 1 : 0;
      if (ai !== bi) return bi - ai;
      return b.skiDayMs - a.skiDayMs;
    });
    return due[0];
  }

  // ─── 4. Submit a crowd-reality report ───────────────────────────────────────

  function submitReport(key, answer) {
    var arr = _load();
    var e = arr.find(function (x) { return x.key === key; });
    if (!e || e.reported) return;
    e.reported = true;
    e.reportAnswer = answer; // 'quiet' | 'about_right' | 'packed' | 'dismissed'
    _save(arr);
    if (answer === 'dismissed') return; // dismissal is local only, no server row
    _post({
      type:            'crowd_report',
      resort_id:       e.resortId,
      resort_name:     e.resortName,
      ski_day:         new Date(e.skiDayMs).toISOString().slice(0, 10),
      predicted_label: e.predictedLabel,
      predicted_score: e.predictedScore,
      intent:          e.intent || '',
      report:          answer, // quiet | about_right | packed
    });
  }

  function _post(body) {
    try {
      body.session_id = _sessionId();
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(function () {});
    } catch (e) {}
  }

  // ─── 5. UI: the ambient prompt (rendered into a host element) ───────────────
  // Caller supplies the mount node and an esc() function. Returns true if a
  // prompt was shown. Renders nothing (and returns false) when nothing is due,
  // which is the common first-timer case.

  function renderPendingPrompt(mount, esc) {
    if (!mount) return false;
    var e = pendingReport();
    if (!e) { mount.innerHTML = ''; mount.hidden = true; return false; }

    var safe = esc || function (s) { return String(s); };
    var dayLabel = _shortDay(e.skiDayMs);
    mount.hidden = false;
    mount.innerHTML =
      '<div class="cfb-prompt" role="group" aria-label="Crowd check">' +
        '<button type="button" class="cfb-dismiss" data-cfb-act="dismiss" aria-label="Dismiss">&times;</button>' +
        '<p class="cfb-q">You looked at <strong>' + safe(e.resortName) + '</strong> for ' + safe(dayLabel) +
          '. How packed was it?</p>' +
        '<div class="cfb-opts">' +
          '<button type="button" class="cfb-opt" data-cfb-act="report" data-cfb-ans="quiet">Quiet</button>' +
          '<button type="button" class="cfb-opt" data-cfb-act="report" data-cfb-ans="about_right">About right</button>' +
          '<button type="button" class="cfb-opt" data-cfb-act="report" data-cfb-ans="packed">Packed</button>' +
        '</div>' +
        '<p class="cfb-thanks" hidden>Thanks. That sharpens the crowd call for everyone.</p>' +
      '</div>';

    var opts = mount.querySelector('.cfb-opts');
    var q    = mount.querySelector('.cfb-q');
    var th   = mount.querySelector('.cfb-thanks');
    mount.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-cfb-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-cfb-act');
      if (act === 'dismiss') {
        submitReport(e.key, 'dismissed');
        mount.hidden = true;
        mount.innerHTML = '';
        return;
      }
      if (act === 'report') {
        submitReport(e.key, btn.getAttribute('data-cfb-ans'));
        if (opts) opts.hidden = true;
        if (q) q.hidden = true;
        if (th) th.hidden = false;
        setTimeout(function () { mount.hidden = true; mount.innerHTML = ''; }, 2600);
      }
    });
    return true;
  }

  function _shortDay(ms) {
    try {
      var d = new Date(ms);
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[d.getDay()] + ' ' + (d.getMonth() + 1) + '/' + d.getDate();
    } catch (e) { return 'that day'; }
  }

  root.WTSN_FEEDBACK = {
    recordPick:          recordPick,
    recordIntent:        recordIntent,
    pendingReport:       pendingReport,
    submitReport:        submitReport,
    renderPendingPrompt: renderPendingPrompt,
  };
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
