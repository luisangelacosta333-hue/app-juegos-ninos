// Service Worker - BuggyIA
var CACHE_NAME = 'buggyia-v2';
var ARCHIVOS_PRECACHE = [
  './',
  './manifest.json',
  './icono-192.png',
  './icono-512.png'
];

// INSTALACION: precache de archivos base
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(ARCHIVOS_PRECACHE);
      })
      .then(function() {
        return self.skipWaiting();
      })
      .catch(function(err) {
        console.log('SW precache error:', err);
      })
  );
});

// ACTIVACION: borrar caches viejos
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(listaCaches) {
      return Promise.all(
        listaCaches.filter(function(nombre) {
          return nombre !== CACHE_NAME;
        }).map(function(nombre) {
          return caches.delete(nombre);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// FETCH: estrategia cache-first, si no esta en cache va a la red y guarda
self.addEventListener('fetch', function(event) {
  // Solo manejar GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(respuestaCache) {
      if (respuestaCache) {
        return respuestaCache;
      }
      return fetch(event.request).then(function(respuestaRed) {
        // Guardar en cache solo respuestas validas y basicas (mismo origen)
        if (!respuestaRed || respuestaRed.status !== 200 || respuestaRed.type !== 'basic') {
          return respuestaRed;
        }
        var respuestaParaCache = respuestaRed.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, respuestaParaCache);
        });
        return respuestaRed;
      }).catch(function() {
        // Fallback: si es una navegacion y no hay red, devolver el index cacheado
        if (event.request.mode === 'navigate') {
          return caches.match('./');
        }
      });
    })
  );
});
