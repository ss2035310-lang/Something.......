/* Shared behaviour for index.html and thank-you.html.
   All editable values live in config.js. */
(function () {
  'use strict';

  /* ---------- Read config safely (works even if a value is missing) ---------- */
  function clean(v, fallback) {
    return (typeof v === 'string' && v.trim() !== '') ? v.trim() : fallback;
  }

  var PAY = clean(typeof PAYMENT_URL !== 'undefined' ? PAYMENT_URL : '', '');
  var DL = clean(typeof EBOOK_DOWNLOAD_URL !== 'undefined' ? EBOOK_DOWNLOAD_URL : '', '');
  var PRICE = clean(typeof PRICE_TEXT !== 'undefined' ? PRICE_TEXT : '', '[INSERT PRICE]');
  var BRAND = clean(typeof BRAND_NAME !== 'undefined' ? BRAND_NAME : '', 'Your Brand');
  var EMAIL = clean(typeof CONTACT_EMAIL !== 'undefined' ? CONTACT_EMAIL : '', '[INSERT CONTACT EMAIL]');
  var REFUND_TEXT = clean(typeof REFUND_POLICY_TEXT !== 'undefined' ? REFUND_POLICY_TEXT : '', '[INSERT REFUND POLICY]');
  var POLICIES = {
    privacy: clean(typeof PRIVACY_URL !== 'undefined' ? PRIVACY_URL : '', ''),
    terms: clean(typeof TERMS_URL !== 'undefined' ? TERMS_URL : '', ''),
    refund: clean(typeof REFUND_URL !== 'undefined' ? REFUND_URL : '', '')
  };
  var STORE = clean(typeof STORE_URL !== 'undefined' ? STORE_URL : '', 'index.html');
  var FILENAME = clean(typeof DOWNLOAD_FILENAME !== 'undefined' ? DOWNLOAD_FILENAME : '', 'ebook.pdf');

  /* A real link must be https:// and must not still contain the PASTE_ placeholder. */
  function isRealUrl(u) {
    return /^https:\/\/[^\s]+$/i.test(u) && u.indexOf('PASTE_') === -1;
  }
  function isSafeLocal(u) {
    return /^(?!\s*(javascript|data|vbscript):)[\w./#?=&%-]+$/i.test(u);
  }
  function isEmail(e) {
    return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(e);
  }
  function isPlaceholder(t) {
    return /\[INSERT|PASTE_/i.test(t);
  }

  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function markPlaceholder(el) { el.classList.add('placeholder'); }

  function addBanner(html) {
    var b = document.createElement('div');
    b.className = 'setup-banner';
    b.setAttribute('role', 'status');
    b.innerHTML = html;
    document.body.insertBefore(b, document.body.firstChild);
  }

  /* ---------- Text placeholders ---------- */
  $all('[data-brand]').forEach(function (el) { el.textContent = BRAND; });
  $all('[data-price]').forEach(function (el) {
    el.textContent = PRICE;
    if (isPlaceholder(PRICE)) markPlaceholder(el);
  });
  $all('[data-refund]').forEach(function (el) {
    el.textContent = REFUND_TEXT;
    if (isPlaceholder(REFUND_TEXT)) markPlaceholder(el);
  });
  $all('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  $all('[data-contact]').forEach(function (el) {
    if (isEmail(EMAIL) && !isPlaceholder(EMAIL)) {
      var a = document.createElement('a');
      a.href = 'mailto:' + EMAIL;
      a.textContent = EMAIL;
      el.textContent = '';
      el.appendChild(a);
    } else {
      el.textContent = EMAIL;
      markPlaceholder(el);
    }
  });

  /* ---------- Footer policy links ---------- */
  $all('[data-policy]').forEach(function (a) {
    var url = POLICIES[a.getAttribute('data-policy')] || '';
    if (url && (isRealUrl(url) || isSafeLocal(url))) {
      a.setAttribute('href', url);
    } else {
      a.removeAttribute('href');
      a.setAttribute('title', 'Add this link in config.js');
      markPlaceholder(a);
      a.textContent = a.textContent + ' [add link]';
    }
  });

  /* ---------- Purchase buttons (sales page) ---------- */
  var buyButtons = $all('[data-buy]');
  if (buyButtons.length) {
    if (isRealUrl(PAY)) {
      buyButtons.forEach(function (a) {
        a.setAttribute('href', PAY);   // same tab, normal link
        a.setAttribute('rel', 'noopener');
      });
    } else {
      buyButtons.forEach(function (a) {
        a.removeAttribute('href');
        a.setAttribute('role', 'link');
        a.setAttribute('aria-disabled', 'true');
        a.setAttribute('title', 'Payment link not set yet. See config.js');
        a.classList.add('is-disabled');
        a.addEventListener('click', function (e) { e.preventDefault(); });
        a.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
        });
      });
      addBanner('<strong>Setup needed:</strong> the &ldquo;Get this eBook&rdquo; buttons are switched off because no payment link is set. ' +
        'Open <code>config.js</code> and paste your https:// checkout link into <code>PAYMENT_URL</code>. This message disappears once it is valid.');
    }
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    function setNav(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 820) setNav(false);
    });
  }

  /* ---------- Sticky mobile CTA ---------- */
  var sticky = document.getElementById('sticky-cta');
  if (sticky && 'IntersectionObserver' in window) {
    document.body.classList.add('has-sticky');
    var stickyLink = sticky.querySelector('a');
    var seen = { hero: true, product: false, final: false };
    function updateSticky() {
      var show = !seen.hero && !seen.product && !seen.final;
      sticky.classList.toggle('is-visible', show);
      if (stickyLink) stickyLink.setAttribute('tabindex', show ? '0' : '-1');
    }
    [['hero', 'hero-cta'], ['product', 'product-details'], ['final', 'final-cta']].forEach(function (pair) {
      var el = document.getElementById(pair[1]);
      if (!el) return;
      new IntersectionObserver(function (entries) {
        seen[pair[0]] = entries[0].isIntersecting;
        updateSticky();
      }, { threshold: 0 }).observe(el);
    });
  }

  /* ---------- Thank-you page: download button ---------- */
  var dlBtn = document.getElementById('download-btn');
  if (dlBtn) {
    var setup = document.getElementById('download-setup');
    if (isRealUrl(DL)) {
      dlBtn.setAttribute('href', DL);
      dlBtn.setAttribute('download', FILENAME);   // works when the file is on the same domain
      dlBtn.setAttribute('rel', 'noopener');
    } else {
      dlBtn.removeAttribute('href');
      dlBtn.setAttribute('role', 'link');
      dlBtn.setAttribute('aria-disabled', 'true');
      dlBtn.classList.add('is-disabled');
      dlBtn.addEventListener('click', function (e) { e.preventDefault(); });
      if (setup) setup.hidden = false;
    }
  }
  $all('[data-store]').forEach(function (a) {
    if (isRealUrl(STORE) || isSafeLocal(STORE)) a.setAttribute('href', STORE);
  });
})();
