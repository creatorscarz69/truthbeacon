/* MONSTRUM / TruthBeacon: free local offline shell, no external resources. */
const CACHE_VERSION = 'truthbeacon-v1-2026-11-13-claim-embed';
const APP_SHELL = ['./', './index.html', './manifest.json', './icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('truthbeacon-v1-') && key !== CACHE_VERSION).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  const scope = new URL(self.registration.scope);
  const isShell = url.pathname === scope.pathname || url.pathname === new URL('index.html', scope).pathname;
  if (req.mode === 'navigate' && !isShell) return;
  if (req.mode === 'navigate') {
    // Network first prevents an old console being pinned; query modes share the shell offline.
    event.respondWith(fetch(req).then(async response => {
      if (response.ok) {const cache = await caches.open(CACHE_VERSION); await cache.put('./index.html', response.clone());}
      return response;
    }).catch(async () => (await caches.match('./index.html')) || Response.error()));
  } else {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
  }
});
