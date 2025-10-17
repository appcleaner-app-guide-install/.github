
const CACHE = 'stt-flat-v1';
const PRECACHE = [
  "404.html",
  "about.html",
  "calculator.html",
  "case-studies.html",
  "contact.html",
  "faq.html",
  "glossary.html",
  "guides.html",
  "index.html",
  "offline.html",
  "principles.html",
  "resources.html",
  "search.html",
  "tools.html",
  "thanks.html",
  "style.css",
  "main.js",
  "theme.js",
  "search.js",
  "calculator.js",
  "sw.js",
  "logo.svg",
  "hero-illustration.svg",
  "icon-192.png",
  "icon-512.png",
  "search-index.json",
  "manifest.webmanifest"
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch', (e)=>{
  const {request} = e;
  e.respondWith((async()=>{
    const cached = await caches.match(request, {ignoreSearch:true});
    if(cached) return cached;
    try{
      const res = await fetch(request);
      if(request.method==='GET' && res && res.status===200 && res.type==='basic'){
        const clone = res.clone();
        const cache = await caches.open(CACHE);
        cache.put(request, clone);
      }
      return res;
    }catch(err){
      return caches.match('offline.html');
    }
  })());
});
