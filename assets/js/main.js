(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initBackToTop();
    initTabs();
    initAOS();
  });

  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    });
  }

  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="bi bi-chevron-up"></i>';
    btn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 300);
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (tabs) {
      var nav = tabs.querySelector('.tab-nav');
      if (!nav) return;
      var btns = nav.querySelectorAll('.tab-btn');
      var contents = tabs.querySelectorAll('.tab-content');

      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          btns.forEach(function (b) { b.classList.remove('active'); });
          contents.forEach(function (c) { c.classList.remove('active'); });
          btn.classList.add('active');
          var target = document.getElementById(btn.getAttribute('data-tab'));
          if (target) target.classList.add('active');
        });
      });
    });
  }

  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        once: true,
        offset: 50
      });
    }
  }
})();
