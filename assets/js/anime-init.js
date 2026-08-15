(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealObserver = null;
  var counterObserver = null;

  function init() {
    if (!window.anime) {
      /* Sin anime.js (p. ej. sin conexión), no ocultar nada */
      document.querySelectorAll('.anime-reveal').forEach(function (el) { el.classList.add('anime-done'); });
      return;
    }
    if (document.body.classList.contains('js-anime')) return;
    document.body.classList.add('js-anime');

    contentEntrance();
    initReveals();
    initCounters();
    initCardIcons();
  }

  /* Animación de entrada en páginas de contenido (h1, párrafo inicial, breadcrumb y navegación) */
  function contentEntrance() {
    var area = document.querySelector('.content-area');
    if (!area) return;

    var targets = [];
    var h1 = area.querySelector(':scope > h1');
    var lead = area.querySelector(':scope > p');
    if (h1) targets.push(h1);
    if (lead) targets.push(lead);

    if (targets.length) {
      if (reduced) return;
      targets.forEach(function (t) { t.style.opacity = '0'; });
      anime({
        targets: targets,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 700,
        easing: 'easeOutCubic',
        delay: anime.stagger(120)
      });
    }

    var crumb = document.querySelector('.breadcrumb');
    if (crumb) {
      if (reduced) return;
      crumb.style.opacity = '0';
      anime({ targets: crumb, opacity: [0, 1], duration: 500, easing: 'linear', delay: 80 });
    }

    var nav = document.querySelector('.page-nav');
    if (nav) {
      if (reduced) return;
      nav.style.opacity = '0';
      anime({ targets: nav, opacity: [0, 1], translateY: [10, 0], duration: 500, easing: 'easeOutCubic', delay: 250 });
    }
  }

  /* Revelado al hacer scroll de elementos con clase .anime-reveal (soporta stagger) */
  function initReveals() {
    var items = document.querySelectorAll('.anime-reveal');
    if (!items.length) return;
    if (reduced) {
      items.forEach(function (el) { el.classList.add('anime-done'); });
      return;
    }

    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        revealObserver.unobserve(el);
        el.classList.add('anime-reveal-inview');

        var isStagger = el.getAttribute('data-anime') === 'stagger';
        if (isStagger) {
          var children = Array.prototype.slice.call(el.children);
          el.classList.add('anime-done');
          anime({
            targets: children,
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 650,
            easing: 'easeOutCubic',
            delay: anime.stagger(110)
          });
          return;
        }

        var delay = parseInt(el.getAttribute('data-anime-delay') || '0', 10);
        anime({
          targets: el,
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 700,
          easing: 'easeOutCubic',
          delay: delay,
          complete: function () { el.classList.add('anime-done'); }
        });
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { revealObserver.observe(el); });
  }

  /* Contadores animados: <span class="js-counter" data-count-to="50" data-suffix="+"> */
  function initCounters() {
    var counters = document.querySelectorAll('.js-counter');
    if (!counters.length) return;

    counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        counterObserver.unobserve(el);

        var to = parseFloat(el.getAttribute('data-count-to') || '0');
        var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';

        if (reduced) {
          el.textContent = prefix + to.toFixed(decimals) + suffix;
          return;
        }

        var obj = { v: 0 };
        anime({
          targets: obj,
          v: to,
          duration: 1600,
          easing: 'easeOutExpo',
          update: function () {
            el.textContent = prefix + obj.v.toFixed(decimals) + suffix;
          }
        });
      });
    }, { threshold: 0.4 });

    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* Micro-interacción: el icono de las cards rebota al pasar el mouse */
  function initCardIcons() {
    if (reduced) return;
    document.querySelectorAll('.card').forEach(function (card) {
      var icon = card.querySelector('.card-icon i');
      if (!icon) return;
      card.addEventListener('mouseenter', function () {
        anime({ targets: icon, scale: [1, 1.18], rotate: [0, 8], duration: 400, easing: 'easeOutElastic(1, .6)' });
      });
      card.addEventListener('mouseleave', function () {
        anime({ targets: icon, scale: 1, rotate: 0, duration: 350, easing: 'easeOutCubic' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('partials-loaded', init);
})();
