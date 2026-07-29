(function () {
  var searchIndex = [];
  var indexLoaded = false;

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function loadIndex() {
    if (indexLoaded) return Promise.resolve();
    var base = document.body.getAttribute('data-base') || '.';
    var url = base === '.' ? 'assets/search-index.json' : base + '/assets/search-index.json';
    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        searchIndex = data;
        indexLoaded = true;
      })
      .catch(function () {});
  }

  function search(query) {
    if (!query || query.length < 2) return [];
    var q = query.toLowerCase();
    var results = [];
    var seen = {};
    searchIndex.forEach(function (page) {
      var score = 0;
      var fields = [
        { text: page.title, weight: 10 },
        { text: page.h1, weight: 8 },
        { text: page.description, weight: 6 },
        { text: (page.headings || []).join(' '), weight: 4 },
        { text: page.text || '', weight: 1 }
      ];
      fields.forEach(function (f) {
        if (f.text.toLowerCase().indexOf(q) !== -1) {
          score += f.weight;
        }
      });
      if (score > 0 && !seen[page.url]) {
        seen[page.url] = true;
        results.push({ url: page.url, title: page.title, description: page.description, score: score });
      }
    });
    results.sort(function (a, b) { return b.score - a.score; });
    return results.slice(0, 12);
  }

  function highlight(text, query) {
    if (!query || query.length < 2) return text;
    var escaped = escapeRegex(query);
    return text.replace(new RegExp('(' + escaped + ')', 'gi'), '<span style="background:var(--accent-light);color:var(--accent);font-weight:700;">$1</span>');
  }

  function initSearch(inputId, resultsClass) {
    var searchInput = document.getElementById(inputId);
    if (!searchInput) return;

    var parent = searchInput.parentNode;

    var resultsContainer = document.createElement('div');
    resultsContainer.className = resultsClass || 'search-results-header';
    resultsContainer.style.cssText =
      'position:absolute;top:100%;right:0;min-width:300px;max-height:380px;overflow-y:auto;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius-md);display:none;z-index:100;box-shadow:0 8px 24px rgba(0,0,0,0.12);margin-top:4px;';
    parent.style.position = 'relative';
    parent.appendChild(resultsContainer);

    searchInput.addEventListener('input', function () {
      var query = this.value.trim();
      if (query.length < 2) {
        resultsContainer.style.display = 'none';
        return;
      }

      if (!indexLoaded) {
        resultsContainer.innerHTML = '<div class="no-results" style="padding:0.75rem 1rem;color:var(--text-muted);font-size:0.85rem;">Cargando índice...</div>';
        resultsContainer.style.display = 'block';
        var self = this;
        loadIndex().then(function () {
          if (self.value.trim().length >= 2) {
            self.dispatchEvent(new Event('input'));
          }
        });
        return;
      }

      var matches = search(query);
      var base = document.body.getAttribute('data-base') || '.';
      var prefix = base === '.' ? '' : base + '/';

      if (matches.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results" style="padding:0.75rem 1rem;color:var(--text-muted);font-size:0.85rem;">Sin resultados</div>';
        resultsContainer.style.display = 'block';
        return;
      }

      resultsContainer.innerHTML = matches.map(function (m) {
        var desc = m.description || '';
        if (desc.length > 120) desc = desc.substring(0, 120) + '...';
        return '<a href="' + prefix + m.url + '" style="display:block;padding:0.6rem 1rem;color:var(--text-primary);text-decoration:none;font-size:0.85rem;border-bottom:1px solid var(--border-color);transition:background var(--transition);">' +
          '<div style="font-weight:600;color:var(--text-primary);font-size:0.9rem;">' + highlight(m.title, query) + '</div>' +
          (desc ? '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">' + highlight(desc, query) + '</div>' : '') +
          '</a>';
      }).join('');
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
    loadIndex();
    initSearch('searchInputHeader', 'search-results-header');
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('partials-loaded', init);
})();
