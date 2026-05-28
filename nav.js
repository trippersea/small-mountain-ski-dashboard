// nav.js — shared nav interactions (build-time injected nav HTML)
(function () {
  // ── Browse dropdown ──────────────────────────────────────────────────
  var browseWrap = document.querySelector('.nav-browse-wrap');
  var browseBtn = document.querySelector('.nav-browse-btn');

  // ── Subscribe dropdown ───────────────────────────────────────────────
  var subWrap = document.getElementById('navSubDropdown') && document.querySelector('.nav-subscribe-wrap');
  var subBtn = document.getElementById('navSubBtn');
  var subDropdown = document.getElementById('navSubDropdown');
  var subSubmit = document.getElementById('navSubSubmit');
  var subInput = document.getElementById('navSubEmail');
  var subErr = document.getElementById('navSubErr');
  var subForm = document.getElementById('navSubForm');
  var subOk = document.getElementById('navSubOk');

  function closeBrowse() {
    if (browseWrap) browseWrap.classList.remove('open');
    if (browseBtn) browseBtn.setAttribute('aria-expanded', 'false');
  }
  function closeSub() {
    if (subWrap) subWrap.classList.remove('open');
    if (subBtn) subBtn.setAttribute('aria-expanded', 'false');
  }

  if (browseWrap && browseBtn) {
    browseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeSub();
      var open = browseWrap.classList.toggle('open');
      browseBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  if (subWrap && subBtn && subDropdown) {
    subBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeBrowse();
      var open = subWrap.classList.toggle('open');
      subBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && subInput) setTimeout(function () { subInput.focus(); }, 50);
    });
    subDropdown.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  document.addEventListener('click', function () { closeBrowse(); closeSub(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeBrowse(); closeSub(); }
  });

  // Subscribe form submission
  if (subSubmit && subInput && subErr && subForm && subOk) {
    function setSubErr(msg) {
      subErr.textContent = msg;
      subErr.style.display = msg ? 'block' : 'none';
    }
    function handleSub() {
      setSubErr('');
      var email = subInput.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setSubErr('Enter a valid email address.');
        subInput.focus();
        return;
      }
      subSubmit.disabled = true;
      subSubmit.textContent = 'Saving...';
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })
        .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function () {
          subForm.style.display = 'none';
          subOk.style.display = 'block';
        })
        .catch(function () {
          subSubmit.disabled = false;
          subSubmit.textContent = 'Get the picks';
          setSubErr('Something went wrong. Try again.');
        });
    }
    subSubmit.addEventListener('click', handleSub);
    subInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') handleSub(); });
  }

  // ── Scroll cue: hide on first scroll, click to scroll to results ─────
  (function () {
    var cue = document.getElementById('scrollCue');
    if (!cue) return;
    cue.addEventListener('click', function () {
      var target = document.querySelector('.hn-results-region') || document.querySelector('.container');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    var gone = false;
    window.addEventListener('scroll', function () {
      if (!gone && window.scrollY > 80) {
        gone = true;
        cue.classList.add('hidden');
      }
    }, { passive: true });
  })();
})();

