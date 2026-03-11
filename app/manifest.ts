export default function manifest() {
  return {
    name: 'Fusion',
    short_name: 'Fusion',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',

    icons: [
      {
        src: '/icons/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/Icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],

    screenshots: [
      {
        src: '/icons/screenshot2.png',
        sizes: '375x667',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/icons/screenshot3.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
  }
}
