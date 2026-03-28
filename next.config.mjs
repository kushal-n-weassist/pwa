import withPWAInit from "@ducanh2912/next-pwa";


const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    additionalManifestEntries: [
      { url: '/dashboard', revision: '1' },
      { url: '/profile', revision: '1' },
      { url: '/profile/privacy-policy', revision: '1' },
      { url: '/profile/terms-conditions', revision: '1' },
      { url: '/profile/settings', revision: '1' },
      { url: '/profile/contact-us', revision: '1' },
      { url: '/notification', revision: '1' },
      { url: '/services', revision: '1' },
    ],
    runtimeCaching: [

      {
        urlPattern: /\/_next\/static.+\.js$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static-js",
          expiration: { maxEntries: 128, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
        },
      },
      {
        urlPattern: /\.(?:css|less)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-css",
          expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      // Images
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-images",
          expiration: { maxEntries: 128, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      // Next.js image optimizer
      {
        urlPattern: /\/_next\/image\?url=.+$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-image-optimizer",
          expiration: { maxEntries: 128, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      // Fonts
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-fonts",
          expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 year
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-stylesheets",
          expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 days
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-webfonts",
          expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },

      {
        urlPattern: ({ sameOrigin, url: { pathname } }) =>
          sameOrigin && pathname.startsWith("/api/"),
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 }, // 24 hrs
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