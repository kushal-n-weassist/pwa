
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('page-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/dashboard',
        '/profile',
        '/services',
        '/notification',
        '/offline',
      ]).catch(err => console.log('Precache failed:', err));
    })
  );
});