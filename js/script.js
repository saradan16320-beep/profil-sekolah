/* ==========================================================================
   SMKS Saradan — Skrip JavaScript Statis Sederhana
   Menu seluler, filter jurusan, salin alamat, validasi formulir, & FAQ
   ========================================================================== */

(function () {
  'use strict';

  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var drawer = document.querySelector('[data-nav-drawer]');
    if (!toggle || !drawer) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      drawer.classList.toggle('is-open', !expanded);
    });
  }

  function initImageFallbacks() {
    var images = document.querySelectorAll('img[data-fallback-frame]');
    images.forEach(function (img) {
      function markBroken() {
        var frame = img.closest('.media-frame');
        if (frame) {
          img.style.display = 'none';
          frame.classList.add('is-broken');
        }
      }

      if (img.complete && img.naturalWidth === 0) {
        markBroken();
      } else {
        img.addEventListener('error', markBroken);
      }
    });
  }

  function initMajorFilter() {
    var bar = document.querySelector('[data-major-filter]');
    if (!bar) return;

    var tabs = bar.querySelectorAll('[data-filter]');
    var cards = document.querySelectorAll('[data-major-card]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-filter');

        tabs.forEach(function (btn) {
          var isCurrent = btn === tab;
          btn.classList.toggle('is-active', isCurrent);
          btn.setAttribute('aria-pressed', String(isCurrent));
        });

        cards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          var matches = target === 'semua' || category === target;
          card.hidden = !matches;
        });
      });
    });
  }

  function initCopyAddress() {
    var buttons = document.querySelectorAll('[data-copy-text]');
    var feedback = document.querySelector('[data-copy-feedback]');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy-text') || '';
        var label = btn.getAttribute('data-copy-label') || 'Informasi';

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            if (feedback) {
              feedback.textContent = label + ' disalin: ' + text;
            }
          });
        } else if (feedback) {
          feedback.textContent = label + ': ' + text;
        }
      });
    });
  }

  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var statusBox = form.querySelector('[data-form-status]');

    function setFieldError(fieldName, message) {
      var input = form.querySelector('[name="' + fieldName + '"]');
      var errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
      if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errorEl) errorEl.textContent = message || '';
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nama = (form.nama.value || '').trim();
      var email = (form.email.value || '').trim();
      var jurusan = (form.jurusan.value || '').trim();
      var pesan = (form.pesan.value || '').trim();

      var valid = true;

      if (nama.length < 3) {
        setFieldError('nama', 'Nama lengkap minimal 3 karakter.');
        valid = false;
      } else {
        setFieldError('nama', '');
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setFieldError('email', 'Masukkan alamat email yang valid.');
        valid = false;
      } else {
        setFieldError('email', '');
      }

      if (!jurusan) {
        setFieldError('jurusan', 'Pilih jurusan atau topik pertanyaan.');
        valid = false;
      } else {
        setFieldError('jurusan', '');
      }

      if (pesan.length < 10) {
        setFieldError('pesan', 'Tuliskan pesan minimal 10 karakter.');
        valid = false;
      } else {
        setFieldError('pesan', '');
      }

      if (!statusBox) return;

      if (!valid) {
        statusBox.className = 'form-status is-error';
        statusBox.textContent = 'Mohon lengkapi kolom yang ditandai sebelum mengirim.';
        return;
      }

      var subject = encodeURIComponent('[Website SMKS Saradan] ' + jurusan + ' - ' + nama);
      var body = encodeURIComponent(
        'Nama: ' + nama + '\nEmail: ' + email + '\nMinat/Topik: ' + jurusan + '\n\n' + pesan
      );

      statusBox.className = 'form-status is-success';
      statusBox.innerHTML =
        '<strong>Pesan siap dikirim.</strong> Terima kasih, ' +
        nama.replace(/</g, '&lt;') +
        '. Silakan lanjutkan pengiriman melalui aplikasi email Anda: <a href="mailto:info@smkssaradan.sch.id?subject=' +
        subject +
        '&body=' +
        body +
        '" style="text-decoration:underline;font-weight:600;">Buka Email</a>.';

      form.reset();
    });
  }

  function initFaqAccordion() {
    var triggers = document.querySelectorAll('[data-faq-trigger]');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var panelId = trigger.getAttribute('aria-controls');
        var panel = panelId ? document.getElementById(panelId) : null;
        var icon = trigger.querySelector('.faq-icon');

        trigger.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
        if (icon) icon.textContent = expanded ? '+' : '−';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initImageFallbacks();
    initMajorFilter();
    initCopyAddress();
    initContactForm();
    initFaqAccordion();
  });
})();
