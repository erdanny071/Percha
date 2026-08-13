const CACHE_NAME = 'percha-cache-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './service-worker.js',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-512.png'
];

// Install: precache core app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Fetch: navigation => network-first; others => cache-first then network (and cache)
self.addEventListener('fetch', event => {
  const req = event.request;
  // navigation (HTML) requests: network-first with fallback to cached shell
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(resp => {
        return resp;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // For other GET requests: try cache first, update from network in background
  if (req.method === 'GET') {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) {
          // update cache in background
          fetch(req).then(resp => {
            if(resp && resp.status === 200) {
              caches.open(CACHE_NAME).then(cache => cache.put(req, resp.clone()));
            }
          }).catch(()=>{});
          return cached;
        }
        return fetch(req).then(resp => {
          if(resp && resp.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(req, resp.clone()));
          }
          return resp;
        }).catch(() => caches.match('./index.html'));
      })
    );
  }
});