import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Xtracity Hostels & Apartments',
    short_name: 'Xtracity',
    description: 'Experience premium student living in Ghana. High-speed Wi-Fi, 24/7 security, backup power, and a clean, safe environment.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E03B0D',
    icons: [
      {
        src: '/LOGO.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/LOGO.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
