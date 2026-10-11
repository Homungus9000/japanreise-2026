const CACHE_NAME = 'japanreise-offline-v1';
const OFFLINE_ASSETS = ['./', './index.html', './manifest.webmanifest', './service-worker.js', './japanreise-icon.svg'];
const scopedURL = path => new URL(path, self.registration.scope).href;

async function notify(message) {
  const clients = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
  clients.forEach(client => client.postMessage(message));
}

async function cacheTravelPlan({progress = false} = {}) {
  const cache = await caches.open(CACHE_NAME);
  let done = 0;
  for (const path of OFFLINE_ASSETS) {
    const request = new Request(scopedURL(path), {cache: 'reload'});
    const response = await fetch(request);
    if (!response.ok) throw new Error('Offline-Datei nicht verfügbar');
    await cache.put(request, response.clone());
    done += 1;
    if (progress) await notify({type: 'offline-progress', done, total: OFFLINE_ASSETS.length});
  }
  return done;
}

async function hasSavedPlan(cache) {
  return Boolean(await cache.match(scopedURL('./')));
}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('message', event => {
  if (!['cache-trip-plan', 'refresh-trip-plan'].includes(event.data?.type)) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (event.data.type === 'refresh-trip-plan' && !await hasSavedPlan(cache)) return;
    try {
      const assets = await cacheTravelPlan({progress: event.data.type === 'cache-trip-plan'});
      await notify({type: 'offline-ready', assets, refreshed: event.data.type === 'refresh-trip-plan'});
    } catch {
      await notify({type: 'offline-error'});
    }
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const saved = await hasSavedPlan(cache);
    try {
      const response = await fetch(event.request);
      if (saved && response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      return (await cache.match(event.request, {ignoreSearch: true})) || Response.error();
    }
  })());
});
