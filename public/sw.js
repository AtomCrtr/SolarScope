// The registration URL carries the deployment id (?v=…), so every deployment gets a
// fresh cache and the activate step removes the previous one.
const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev'
const CACHE_NAME = `solarscope-shell-${VERSION}`
const APP_SHELL = ['/', '/en', '/offline', '/manifest.webmanifest', '/solarscope-icon-192.png', '/solarscope-icon-512.png']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(APP_SHELL.map(url => cache.add(new Request(url, { cache: 'reload' })))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

function putInCache(request, response) {
  if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()))
  return response
}

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => putInCache(request, response))
        .catch(async () => (await caches.match(request)) || (await caches.match('/offline'))),
    )
    return
  }

  // Hashed build assets never change: cache first.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => putInCache(request, response))),
    )
    return
  }

  // Public files keep their name when replaced: serve the cached copy, refresh it in the background.
  if (/\.(?:png|webp|jpe?g|svg|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(response => putInCache(request, response))
        if (!cached) return network
        event.waitUntil(network.catch(() => undefined))
        return cached
      }),
    )
  }
})
