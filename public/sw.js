// public/sw.js

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // این یک سرویس ورکر ساده است تا مرورگر سایت شما را به عنوان اپلیکیشن بشناسد و دکمه نصب را فعال کند
});