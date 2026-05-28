/**
 * Footer newsletter signup — injected before .site-footer on every page.
 * Homepage may include .nl-band inline; skip injection if already present.
 */
(function () {
  function initForm(root) {
    var btn = root.querySelector('#nlSubmitBtn');
    var inp = root.querySelector('#nlEmailInput');
    var err = root.querySelector('#nlErrMsg');
    var form = root.querySelector('#nlFormState');
    var ok = root.querySelector('#nlSuccessState');
    if (!btn || !inp || !form || !ok) return;

    var submitLabel = btn.textContent;

    function setErr(msg) {
      err.textContent = msg;
      err.style.display = msg ? 'block' : 'none';
    }

    function handleSubmit() {
      setErr('');
      var email = inp.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErr('Enter a valid email address.');
        inp.focus();
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Saving...';
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })
        .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function () {
          form.style.display = 'none';
          ok.style.display = 'block';
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = submitLabel;
          setErr('Something went wrong. Try again in a moment.');
        });
    }

    btn.addEventListener('click', handleSubmit);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleSubmit();
    });
  }

  function buildBand() {
    var section = document.createElement('section');
    section.className = 'nl-band';
    section.setAttribute('aria-labelledby', 'nl-headline');
    section.innerHTML =
      '<div class="nl-inner">' +
        '<div>' +
          '<div class="nl-kicker">Weekly during ski season</div>' +
          '<h2 class="nl-headline" id="nl-headline">' +
            'One top pick per region.<br>' +
            '<em>Every Friday, all winter.</em>' +
          '</h2>' +
          '<p class="nl-body">' +
            'Each week we run the full scoring engine across 300 mountains and surface the best bet for your region — snow totals, crowd outlook, pass coverage. Northeast, Midwest, Rockies, Southeast, and West. One clear call, not a list to sort through yourself.' +
          '</p>' +
        '</div>' +
        '<div>' +
          '<div id="nlFormState">' +
            '<label class="nl-form-label" for="nlEmailInput">Your email address</label>' +
            '<div class="nl-field-row">' +
              '<input type="email" id="nlEmailInput" class="nl-email" placeholder="you@email.com" autocomplete="email" spellcheck="false" />' +
              '<button id="nlSubmitBtn" class="nl-submit" type="button">Get the weekly picks</button>' +
            '</div>' +
            '<p id="nlErrMsg" class="nl-err" role="alert"></p>' +
            '<p class="nl-fine">Weekly during ski season. No spam. Unsubscribe anytime.</p>' +
            '<div class="nl-chips">' +
              '<span class="nl-chip">5 regions covered</span>' +
              '<span class="nl-chip">Every Friday</span>' +
              '<span class="nl-chip">Snow + crowds + pass</span>' +
            '</div>' +
          '</div>' +
          '<div id="nlSuccessState" class="nl-success">' +
            '<div class="nl-success-ring">&#10003;</div>' +
            '<p class="nl-success-head">You\'re on the list</p>' +
            '<p class="nl-success-sub">First issue hits when the season opens. See you out there.</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    return section;
  }

  function mount() {
    var existing = document.querySelector('.nl-band');
    if (existing) {
      initForm(existing);
      return;
    }

    var footer = document.querySelector('.site-footer');
    if (!footer) return;

    var band = buildBand();
    footer.parentNode.insertBefore(band, footer);
    initForm(band);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
