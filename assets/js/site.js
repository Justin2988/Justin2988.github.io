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
     Work filter
     Buttons are rendered by the page; without JS every card simply stays shown.
     ------------------------------------------------------------------------ */

  function initFilter() {
    var bar = document.querySelector('[data-filter-bar]');
    var grid = document.querySelector('[data-filter-grid]');
    if (!bar || !grid) return;

    var buttons = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-categories]'));
    var status = document.querySelector('[data-filter-status]');

    function apply(filter) {
      var shown = 0;

      cards.forEach(function (card) {
        var categories = (card.getAttribute('data-categories') || '').split(/\s+/);
        var match = filter === 'all' || categories.indexOf(filter) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });

      buttons.forEach(function (button) {
        button.setAttribute(
          'aria-pressed',
          button.getAttribute('data-filter') === filter ? 'true' : 'false'
        );
      });

      if (status) {
        status.textContent =
          shown + (shown === 1 ? ' project shown' : ' projects shown');
      }
    }

    bar.addEventListener('click', function (event) {
      var button = event.target.closest('[data-filter]');
      if (button) apply(button.getAttribute('data-filter'));
    });

    apply('all');
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
    initFilter();
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
