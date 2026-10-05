const CACHE_NAME='buggyia-v2';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(ks){
      return Promise.all(ks.filter(function(k){return k!==CACHE_NAME;}).map(function(k){return caches.delete(k);}));
    }).then(function(){return clients.claim();})
  );
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(function(res){
      try{
        if(e.request.url.indexOf('manifest')===-1 && e.request.url.indexOf('sw.js')===-1){
          var clon=res.clone();
          caches.open(CACHE_NAME).then(function(c){c.put(e.request,clon);}).catch(function(){});
        }
      }catch(err){}
      return res;
    }).catch(function(){return caches.match(e.request).then(function(r){return r||new Response('Sin conexion.');});})
  );
});
