const V='leadradar-v1',CDN='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(V);await c.addAll(CORE);
  try{await c.put(CDN,await fetch(new Request(CDN,{mode:'no-cors'})))}catch(_){}
  self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==V)await caches.delete(k);
  await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith((async()=>{
    const c=await caches.open(V),hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>null);
    if(hit)return hit;
    const r=await net;
    return r||(e.request.mode==='navigate'?c.match('./index.html'):Response.error());
  })())});
