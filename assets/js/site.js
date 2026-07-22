/* ==========================================================================
   Justin Barczewski — Professional Portfolio
   Progressive enhancement only. Every feature here degrades to working HTML.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Mobile navigation
     Toggle + Escape to close + click-outside + Tab containment while open.
     ------------------------------------------------------------------------ */

  function initNav() {
    var toggle = document.querySelector('.nav__toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function isMobile() {
      return window.matchMedia('(max-width: 820px)').matches;
    }

    function open() {
      nav.setAttribute('data-open', 'true');
      toggle.setAttribute('aria-expanded', 'true');
      document.addEventListener('keydown', onKeydown);
      document.addEventListener('click', onDocumentClick);
    }

    function close(returnFocus) {
      nav.removeAttribute('data-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onDocumentClick);
      if (returnFocus) toggle.focus();
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function onKeydown(event) {
      if (event.key === 'Escape') {
        close(true);
        return;
      }

      if (event.key !== 'Tab' || !isMobile()) return;

      // Keep focus inside the open menu (plus the toggle itself).
      var items = [toggle].concat(
        Array.prototype.slice.call(nav.querySelectorAll(FOCUSABLE))
      ).filter(function (el) {
        return el.offsetParent !== null || el === toggle;
      });

      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function onDocumentClick(event) {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) close(false);
    }

    toggle.addEventListener('click', function () {
      isOpen() ? close(false) : open();
    });

    // Following a link should dismiss the menu.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a') && isOpen()) close(false);
    });

    // Crossing the desktop breakpoint while open would leave stale state behind.
    var mq = window.matchMedia('(min-width: 821px)');
    var onChange = function (event) {
      if (event.matches && isOpen()) close(false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ------------------------------------------------------------------------
     Scroll spy
     Highlights the nav link for the section currently in view. Only sections
     that a header link actually points at participate; on pages without those
     sections (the CV) this is a no-op.
     ------------------------------------------------------------------------ */

  function initScrollSpy() {
    var links = document.querySelectorAll('.site-header .nav__link[href*="#"]');
    var targets = [];

    Array.prototype.forEach.call(links, function (link) {
      var hash = link.getAttribute('href').split('#')[1];
      var section = hash && document.getElementById(hash);
      if (section) targets.push({ link: link, section: section });
    });

    if (!targets.length) return;

    var ticking = false;

    function update() {
      ticking = false;

      // The "reading line" sits a third of the way down the viewport.
      var line = window.innerHeight * 0.35;
      var active = null;

      targets.forEach(function (target) {
        var rect = target.section.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) active = target;
      });

      targets.forEach(function (target) {
        target.link.classList.toggle('is-active', target === active);
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------------
     Deep links into <details>
     Old case-study URLs redirect to /#<case-id>. When a hash points at (or
     inside) a collapsed <details>, open it before scrolling so the reader
     lands on the content rather than a closed card.
     ------------------------------------------------------------------------ */

  function initHashOpen() {
    function openForHash() {
      var id = location.hash.replace(/^#/, '');
      if (!id) return;

      var el;
      try {
        el = document.getElementById(decodeURIComponent(id));
      } catch (e) {
        el = document.getElementById(id);
      }
      if (!el) return;

      var details = el.tagName === 'DETAILS' ? el : el.closest('details');
      var opened = false;

      while (details) {
        if (!details.open) {
          details.open = true;
          opened = true;
        }
        details = details.parentElement && details.parentElement.closest('details');
      }

      // Opening shifts layout, so re-run the scroll the browser already did.
      if (opened) {
        requestAnimationFrame(function () {
          el.scrollIntoView();
        });
      }
    }

    openForHash();
    window.addEventListener('hashchange', openForHash);
  }

  /* ------------------------------------------------------------------------
     Print
     Collapsed content would vanish from paper, so open every <details> before
     printing and restore the reader's state afterwards.
     ------------------------------------------------------------------------ */

  function initPrintExpand() {
    var reopened = [];

    window.addEventListener('beforeprint', function () {
      reopened = [];
      Array.prototype.forEach.call(
        document.querySelectorAll('details:not([open])'),
        function (details) {
          details.open = true;
          reopened.push(details);
        }
      );
    });

    window.addEventListener('afterprint', function () {
      reopened.forEach(function (details) {
        details.open = false;
      });
      reopened = [];
    });
  }

  /* ------------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------------ */

  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // No observer support, or the user asked for less motion: show everything now.
    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Email assembly
     Keeps a plain-text address out of the markup that scrapers read, while the
     <noscript> fallback in each page keeps it available if this never runs.
     ------------------------------------------------------------------------ */

  function initEmail() {
    var nodes = document.querySelectorAll('[data-email-user][data-email-domain]');

    Array.prototype.forEach.call(nodes, function (node) {
      var address =
        node.getAttribute('data-email-user') + '@' + node.getAttribute('data-email-domain');

      node.setAttribute('href', 'mailto:' + address);

      var label = node.querySelector('[data-email-label]');
      if (label) label.textContent = address;

      node.hidden = false;

      var fallback = document.getElementById(node.getAttribute('data-email-fallback'));
      if (fallback) fallback.hidden = true;
    });
  }

  /* ------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */

  function initYear() {
    var nodes = document.querySelectorAll('[data-current-year]');
    var year = String(new Date().getFullYear());

    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = year;
    });
  }

  /* ------------------------------------------------------------------------
     Print trigger (CV page)
     ------------------------------------------------------------------------ */

  function initPrint() {
    var buttons = document.querySelectorAll('[data-print]');

    Array.prototype.forEach.call(buttons, function (button) {
      button.hidden = false;
      button.addEventListener('click', function () {
        window.print();
      });
    });
  }

  /* ---------------------------------------------------------------------- */

  function init() {
    document.documentElement.classList.remove('no-js');
    initNav();
    initScrollSpy();
    initHashOpen();
    initPrintExpand();
    initReveal();
    initEmail();
    initYear();
    initPrint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
