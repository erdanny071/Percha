const CACHE_NAME = 'percha-cache-v2';
const ASSETS = [
  '/',
  '/manifest.json',
  '/service-worker.js',
  '/icon-192.png',
  '/icon-256.png',
  '/icon-512.png'
];

// Install: precache core app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => {}))
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

  // Never cache Next.js internals / HMR / API traffic.
  const url = new URL(req.url);
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/')) {
    return;
  }

  // navigation (HTML) requests: network-first with fallback to cached shell
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(resp => resp).catch(() => caches.match('/'))
    );
    return;
  }

  // For other GET requests: try cache first, update from network in background
  if (req.method === 'GET') {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) {
          fetch(req).then(resp => {
            if (resp && resp.status === 200) {
              caches.open(CACHE_NAME).then(cache => cache.put(req, resp.clone()));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(req).then(resp => {
          if (resp && resp.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(req, resp.clone()));
          }
          return resp;
        }).catch(() => caches.match('/'));
      })
    );
  }
});
