//vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Orrery Orbit Simulation',
        short_name: 'Gozlemevi',
        description: 'Gelişmiş Astronomik Yörünge ve Evre Simülasyonu',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'favicon.png',
            sizes: 'any',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        dontCacheBustURLsMatching: new RegExp('.*'),
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});