const CACHE_NAME = 'buggyia-v1';

// Se instala el Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Fuerza la activación inmediata
});

// Se activa el Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Toma el control de la página rápido
});

// ESTO ES OBLIGATORIO PARA QUE GOOGLE CHROME DEJE INSTALAR LA APP (PWA)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            // Si no hay internet, muestra un mensaje amigable con tu marca
            return new Response("Estás sin conexión a internet. Revisá tu red para seguir aprendiendo con Buggy IA.");
        })
    );
});
