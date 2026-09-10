const CACHE='somagede-pwa-v11';

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(['/','/informasi','/layanan','/profil','/kontak','/wilayah','/chatbot','/download','/app-version.json','/assets/loading-support/banyumas.jpg.b64','/assets/loading-support/germas.jpg.b64','/assets/loading-support/kemenkes.jpg.b64','/assets/loading-support/dinkominfo.jpg.b64']))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(
    fetch(event.request)
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
