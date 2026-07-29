(function () {
  function initNavbar() {
    const hamburger = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('navbarMenu');
    const overlay = document.getElementById('navbarOverlay');

    if (hamburger && menu) {
      hamburger.addEventListener('click', function () {
        menu.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
      });

      if (overlay) {
        overlay.addEventListener('click', function () {
          menu.classList.remove('open');
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        });
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          menu.classList.remove('open');
          if (overlay) overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }

    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(function (dd) {
      const toggle = dd.querySelector('.dropdown-toggle');
      const menu = dd.querySelector('.dropdown-menu');
      if (!toggle || !menu) return;
      let ddTimer;

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.innerWidth < 768) {
          menu.classList.toggle('show');
          toggle.classList.toggle('open');
          return;
        }
        const isOpen = menu.classList.contains('show');
        closeAllDropdowns();
        if (!isOpen) {
          menu.classList.add('show');
          toggle.classList.add('open');
        }
      });

      dd.addEventListener('mouseenter', function () {
        clearTimeout(ddTimer);
        if (window.innerWidth >= 768) {
          menu.classList.add('show');
          toggle.classList.add('open');
        }
      });

      dd.addEventListener('mouseleave', function () {
        if (window.innerWidth >= 768) {
          ddTimer = setTimeout(function () {
            menu.classList.remove('show');
            toggle.classList.remove('open');
          }, 200);
        }
      });
    });

    var submenus = document.querySelectorAll('.dropdown-submenu');
    submenus.forEach(function (sm) {
      var toggle = sm.querySelector('.dropdown-submenu-toggle');
      var sub = sm.querySelector('.dropdown-menu-sub');
      if (!toggle || !sub) return;

      var closeTimer;

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.innerWidth < 768) {
          sub.classList.toggle('show');
          toggle.classList.toggle('open');
        }
      });

      if (window.innerWidth >= 768) {
        sm.addEventListener('mouseenter', function () {
          clearTimeout(closeTimer);
          sub.classList.add('show');
          toggle.classList.add('open');
        });
        sm.addEventListener('mouseleave', function () {
          closeTimer = setTimeout(function () {
            sub.classList.remove('show');
            toggle.classList.remove('open');
          }, 150);
        });
        sub.addEventListener('mouseenter', function () {
          clearTimeout(closeTimer);
          sub.classList.add('show');
        });
        sub.addEventListener('mouseleave', function () {
          closeTimer = setTimeout(function () {
            sub.classList.remove('show');
            toggle.classList.remove('open');
          }, 150);
        });
      }
    });

    function closeAllDropdowns() {
      document.querySelectorAll('.dropdown-menu').forEach(function (m) {
        m.classList.remove('show');
      });
      document.querySelectorAll('.dropdown-toggle').forEach(function (t) {
        t.classList.remove('open');
      });
    }

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.dropdown')) {
        closeAllDropdowns();
      }
    });

    var searchToggle = document.getElementById('searchToggle');
    var searchBox = document.getElementById('searchBox');
    if (searchToggle && searchBox) {
      searchToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        searchBox.classList.toggle('open');
        if (searchBox.classList.contains('open')) {
          var input = searchBox.querySelector('input');
          if (input) setTimeout(function () { input.focus(); }, 100);
        }
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest('#searchBox')) {
          searchBox.classList.remove('open');
        }
      });
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        if (menu) menu.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initNavbar);
  document.addEventListener('partials-loaded', initNavbar);
})();
