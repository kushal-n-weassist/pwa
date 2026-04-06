import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
  // disable: false,
  disable: process.env.NODE_NODE === 'development',
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    additionalManifestEntries: [
      { url: '/', revision: '4' },
      { url: '/dashboard', revision: '4' },
      { url: '/profile', revision: '4' },
      { url: '/profile/privacy-policy', revision: '4' },
      { url: '/profile/terms-conditions', revision: '4' },
      { url: '/profile/contact-us', revision: '4' },
      { url: '/profile/settings', revision: '4' },
      { url: '/services', revision: '4' },
      { url: '/notification', revision: '4' },
      { url: '/offline', revision: '4' },
    ],
    runtimeCaching: [
      {
        urlPattern: ({ url: { pathname } }) =>
          pathname.startsWith("/api/") || pathname.includes("weassist.api"),
        handler: "NetworkOnly",
      },
      {
        urlPattern: /\/_next\/static\/.+/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-images",
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
});


/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://octa.weassist.co.in/api/:path*',
      },
      {
        source: '/digio-api/:path*',
        destination: 'https://ext.digio.in:444/:path*',
        basePath: false,
      },
    ];
  },
};

export default withPWA(nextConfig);