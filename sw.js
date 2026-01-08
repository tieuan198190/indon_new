const CACHE_NAME = 'comap-pwa-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './logo.jpeg',
  './location.html',
  './location_logo.jpeg',
  './thongtindonhang.html',
  './thongtindonhang_logo.jpeg',
  './bochang.html',
  './bochang_logo.jpeg',
  './hangbom.html',
  './hangbom_logo.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((oldKey) => caches.delete(oldKey))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  // Stale-While-Revalidate Strategy
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      // 1. Fetch from network and update cache in background
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })
        .catch(() => cachedResponse); // Fallback if offline

      // 2. Return cached response immediately if available, else wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
