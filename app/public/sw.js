const CACHE_NAME = 'zurich-quiz-v1';
const BASE_PATH = '/naturalization/';

// Assets to cache on install
const ASSETS_TO_CACHE = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'gktzh.svg',
  BASE_PATH + 'manifest.json',
  // Images used in questions
  BASE_PATH + '3.png',
  BASE_PATH + '5.png',
  BASE_PATH + '7.png',
  BASE_PATH + '9.png',
  BASE_PATH + '10.png',
  BASE_PATH + '11.png',
  BASE_PATH + '12.png',
  BASE_PATH + '13.png',
  BASE_PATH + '14.png',
  BASE_PATH + '15.png',
  BASE_PATH + '17.png',
  BASE_PATH + '19.png',
  BASE_PATH + '21.png',
  BASE_PATH + '23.png'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache successful responses
        if (fetchResponse && fetchResponse.status === 200) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Return offline page or fallback if available
      return caches.match(BASE_PATH + 'index.html');
    })
  );
});
