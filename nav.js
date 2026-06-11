// nav.js — shared nav interactions (build-time injected nav HTML)
(function () {
  var browseWraps = document.querySelectorAll('.nav-browse-wrap');
  var browseBtns = document.querySelectorAll('.nav-browse-btn');

  var subWraps = document.querySelectorAll('.nav-subscribe-wrap');
  var subBtn = document.getElementById('navSubBtn');
  var subDropdown = document.getElementById('navSubDropdown');
  var subSubmit = document.getElementById('navSubSubmit');
  var subInput = document.getElementById('navSubEmail');
  var subErr = document.getElementById('navSubErr');
  var subForm = document.getElementById('navSubForm');
  var subOk = document.getElementById('navSubOk');

  function closeBrowse(exceptWrap) {
    browseWraps.forEach(function (wrap) {
      if (exceptWrap && wrap === exceptWrap) return;
      wrap.classList.remove('open');
      var btn = wrap.querySelector('.nav-browse-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function closeSub(exceptWrap) {
    subWraps.forEach(function (wrap) {
      if (exceptWrap && wrap === exceptWrap) return;
      wrap.classList.remove('open');
    });
    if (subBtn) subBtn.setAttribute('aria-expanded', 'false');
  }

  browseWraps.forEach(function (wrap) {
    var btn = wrap.querySelector('.nav-browse-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeSub();
      var wasOpen = wrap.classList.contains('open');
      closeBrowse();
      if (!wasOpen) {
        wrap.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  subWraps.forEach(function (wrap) {
    var btn = wrap.querySelector('#navSubBtn') || wrap.querySelector('.dh-btn-sub, .nav-subscribe-btn');
    var dropdown = wrap.querySelector('.nav-subscribe-dropdown');
    if (!btn || !dropdown) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeBrowse();
      var wasOpen = wrap.classList.contains('open');
      closeSub();
      if (!wasOpen) {
        wrap.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        var input = wrap.querySelector('.nav-subscribe-input');
        if (input) setTimeout(function () { input.focus(); }, 50);
      }
    });
    dropdown.addEventListener('click', function (e) { e.stopPropagation(); });
  });

  document.addEventListener('click', function () { closeBrowse(); closeSub(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeBrowse(); closeSub(); }
  });

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
          if (subBtn) {
            subBtn.textContent = 'Subscribed ✓';
            subBtn.classList.add('dh-btn-sub--done');
          }
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
