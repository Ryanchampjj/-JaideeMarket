// Service Worker — minimal สำหรับให้ Chrome เห็นว่าเป็น PWA
// ไม่ทำ caching เพราะ Apps Script API ต้องสด

const CACHE_NAME = 'jaidee-v1';
const STATIC_ASSETS = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // ตอบจาก cache ก่อน — ถ้าไม่มีไป network — ถ้าไม่ได้ก็ไม่เป็นไร
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => cached);
    })
  );
});
