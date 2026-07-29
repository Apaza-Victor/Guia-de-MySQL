(function () {
  var containersCreated = false;

  function initSearch(inputId, resultsClass) {
    var searchInput = document.getElementById(inputId);
    if (!searchInput) return;

    var parent = searchInput.parentNode;

    if (!containersCreated) {
      var resultsContainer = document.createElement('div');
      resultsContainer.className = resultsClass || 'search-results-header';
      resultsContainer.style.cssText =
        'position:absolute;top:100%;right:0;min-width:280px;max-height:320px;overflow-y:auto;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius-md);display:none;z-index:100;box-shadow:0 8px 24px rgba(0,0,0,0.12);margin-top:4px;';
      parent.style.position = 'relative';
      parent.appendChild(resultsContainer);
    }

    var resultsContainer = parent.querySelector('.' + resultsClass.replace(' ', '.'));
    if (!resultsContainer) return;

    searchInput.addEventListener('input', function () {
      var allLinks = [];
      document.querySelectorAll('.sidebar-nav a, .navbar-menu a').forEach(function (a) {
        var href = a.getAttribute('href');
        var text = a.textContent.trim().toLowerCase();
        if (href && !href.startsWith('#') && !href.startsWith('javascript')) {
          allLinks.push({ el: a, text: text, href: href });
        }
      });

      var query = this.value.trim().toLowerCase();
      if (query.length < 2) {
        resultsContainer.style.display = 'none';
        return;
      }

      var matches = allLinks.filter(function (item) {
        return item.text.includes(query);
      });

      if (matches.length === 0) {
        resultsContainer.innerHTML =
          '<div class="no-results" style="padding:0.75rem 1rem;color:var(--text-muted);font-size:0.85rem;">Sin resultados</div>';
        resultsContainer.style.display = 'block';
        return;
      }

      resultsContainer.innerHTML = matches
        .map(function (m) {
          return (
            '<a href="' +
            m.href +
            '" style="display:block;padding:0.5rem 1rem;color:var(--text-primary);text-decoration:none;font-size:0.85rem;border-bottom:1px solid var(--border-color);transition:background var(--transition);">' +
            m.el.textContent.trim() +
            '</a>'
          );
        })
        .join('');
      resultsContainer.style.display = 'block';
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-box-header') && !e.target.closest('.search-box')) {
        resultsContainer.style.display = 'none';
      }
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        resultsContainer.style.display = 'none';
        searchInput.value = '';
      }
    });
  }

  function init() {
    initSearch('searchInputHeader', 'search-results-header');
    initSearch('searchInput', 'search-results');
    containersCreated = true;
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('partials-loaded', init);
})();