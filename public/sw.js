// Minimal service worker for PWA installability — no caching.
// Caching logic can be added here in future issues without restructuring.
const CACHE_NAME = "devfest-roma-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass through all requests — no caching at this stage.
  event.respondWith(fetch(event.request));
});
