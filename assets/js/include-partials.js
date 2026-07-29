(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const basePath = body.getAttribute('data-base') || '.';
    const currentModule = body.getAttribute('data-module');
    const currentPage = body.getAttribute('data-page');

    function loadPartial(id, url) {
      const el = document.getElementById(id);
      if (!el) return Promise.resolve();
      return fetch(basePath + '/' + url)
        .then(function (res) {
          if (!res.ok) throw new Error('Failed to load ' + url);
          return res.text();
        })
        .then(function (html) {
          el.innerHTML = html;
        })
        .catch(function (err) {
          console.warn('Partial load error:', err);
        });
    }

    Promise.all([
      loadPartial('header-placeholder', 'assets/partials/header.html'),
      loadPartial('sidebar-placeholder', 'assets/partials/sidebar.html'),
      loadPartial('footer-placeholder', 'assets/partials/footer.html')
    ]).then(function () {
      fixPartialLinks();
      initSidebar();
      document.dispatchEvent(new CustomEvent('partials-loaded'));
    });

    function fixPartialLinks() {
      if (basePath === '.') return;
      document.querySelectorAll('#header-placeholder a, #sidebar-placeholder a, #footer-placeholder a').forEach(function (a) {
        var href = a.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto')) return;
        a.setAttribute('href', basePath + '/' + href);
      });
    }

    function initSidebar() {
      if (!currentModule) return;
      var modules = document.querySelectorAll('.sidebar-module');
      modules.forEach(function (m) {
        if (m.getAttribute('data-module') === currentModule) {
          m.style.display = 'block';
        } else {
          m.style.display = 'none';
        }
      });
      if (currentPage) {
        var links = document.querySelectorAll('.sidebar-nav a');
        links.forEach(function (a) {
          if (a.getAttribute('data-page') === currentPage) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
          }
        });
      }
    }
  });
})();
