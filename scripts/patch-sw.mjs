import { readFileSync, writeFileSync } from 'fs';

const swPath = './public/sw.js';
let sw = readFileSync(swPath, 'utf-8');

const installPatch = `
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('page-cache-v1').then((cache) => {
      return Promise.allSettled([
        cache.add('/'),
        cache.add('/dashboard'),
        cache.add('/profile'),
        cache.add('/profile/privacy-policy'),
        cache.add('/profile/terms-conditions'),
        cache.add('/profile/contact-us'),
        cache.add('/profile/settings'),
        cache.add('/services'),
        cache.add('/notification'),
        cache.add('/offline'),
      ]).then(results => {
        results.forEach((r, i) => {
          if (r.status === 'rejected') console.warn('Failed to precache entry ' + i, r.reason);
        });
      });
    })
  );
});
`;

writeFileSync(swPath, installPatch + '\n' + sw);
console.log('✅ SW patched');