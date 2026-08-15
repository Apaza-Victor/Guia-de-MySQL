var CACHE_NAME = 'mysql-guide-v2';
var urlsToCache = [
  '/Guia-de-MySQL/',
  '/Guia-de-MySQL/index.html',
  '/Guia-de-MySQL/404.html',
  '/Guia-de-MySQL/assets/css/variables.css',
  '/Guia-de-MySQL/assets/css/base.css',
  '/Guia-de-MySQL/assets/css/layout.css',
  '/Guia-de-MySQL/assets/css/components.css',
  '/Guia-de-MySQL/assets/css/responsive.css',
  '/Guia-de-MySQL/assets/css/3d.css',
  '/Guia-de-MySQL/assets/js/theme-switcher.js',
  '/Guia-de-MySQL/assets/js/include-partials.js',
  '/Guia-de-MySQL/assets/js/navbar.js',
  '/Guia-de-MySQL/assets/js/copy-code.js',
  '/Guia-de-MySQL/assets/js/search.js',
  '/Guia-de-MySQL/assets/js/main.js',
  '/Guia-de-MySQL/assets/js/anime-init.js',
  '/Guia-de-MySQL/assets/js/three-hero.js',
  '/Guia-de-MySQL/assets/js/three-charts.js',
  '/Guia-de-MySQL/assets/js/babylon-er.js',
  '/Guia-de-MySQL/assets/search-index.json',
  '/Guia-de-MySQL/assets/favicon.svg',
  '/Guia-de-MySQL/assets/og-image.svg',
  '/Guia-de-MySQL/assets/partials/header.html',
  '/Guia-de-MySQL/assets/partials/footer.html',
  '/Guia-de-MySQL/assets/partials/sidebar.html'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
});
