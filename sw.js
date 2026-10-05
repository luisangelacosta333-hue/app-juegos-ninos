const CACHE='buggyia-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim());});
self.addEventListener('fetch',e=>{
  e.respondWith(
    fetch(e.request).then(function(res){
      const clon=res.clone();
      caches.open(CACHE).then(function(c){c.put(e.request,clon);}).catch(function(){});
      return res;
    }).catch(function(){return caches.match(e.request);})
  );
});
