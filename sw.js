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

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() =>
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return Response.error();
        })
      )
  );
});
