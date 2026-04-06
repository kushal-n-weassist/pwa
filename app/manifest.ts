import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fusion',
    short_name: 'Fusion',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1DA1FA',
    icons: [
      {
        src: '/Logo-only.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/icons/appscreenshot1.png',
        sizes: '375x667',
        type: 'image/png',
        // @ts-ignore
        form_factor: 'narrow',
      },
      {
        src: '/icons/appscreenshot2.png',
        sizes: '1280x720',
        type: 'image/png',
        // @ts-ignore
        form_factor: 'wide',
      },
    ],
  }
}