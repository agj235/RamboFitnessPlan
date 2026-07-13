const CACHE_NAME = 'rambo-fitness-cache-v5';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './js/app.js',
  './js/auth.js',
  './js/firebase.js',
  './js/navigation.js',
  './js/progress.js',
  './js/settings.js',
  './js/strength.js',
  './js/training.js',
  './js/utils.js',
  './data/workouts4day.json',
  './data/workouts5day.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && request.url.startsWith(self.location.origin)) {
            const responseCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));
          }
          return networkResponse;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
