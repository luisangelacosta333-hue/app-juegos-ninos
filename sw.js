const CACHE_NAME = 'buggy-v1';

// Se instala el Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Fuerza la activación inmediata para no trabar actualizaciones
});

// Se activa el Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Toma el control de la página rápido
});

// ESTO ES OBLIGATORIO PARA QUE GOOGLE CHROME DEJE INSTALAR LA APP (PWA)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            // Si el niño se queda sin internet, le avisa para que no se asuste
            return new Response("Estás sin conexión a internet. Revisá tu red para seguir jugando y aprendiendo en Buggy.");
        })
    );
});
