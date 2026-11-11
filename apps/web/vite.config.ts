import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'manifest.json'],
        manifest: {
          id: '/',
          name: 'TrampoTaxa (Loctaxa)',
          short_name: 'TrampoTaxa',
          description:
            'Plataforma para conectar estabelecimentos contratantes a freelancers para trabalhos temporários e taxas gastronômicas.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#0A0B0E',
          theme_color: '#0A0B0E',
          icons: [
            {
              src: '/icon.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              // NetworkFirst para as chamadas de API (rotas de gigs, earnings, auth, contractor, chat)
              urlPattern: ({ url }) =>
                url.pathname.startsWith('/api') ||
                url.pathname.includes('/gigs') ||
                url.pathname.includes('/earnings') ||
                url.pathname.includes('/contractor') ||
                url.pathname.includes('/chat'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dias
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // CacheFirst para assets estáticos (JS, CSS, imagens, ícones)
              urlPattern: ({ request, url }) =>
                request.destination === 'style' ||
                request.destination === 'script' ||
                request.destination === 'image' ||
                request.destination === 'font' ||
                /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|woff2?|ico)$/i.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-assets-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // CacheFirst para web fonts externas
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
        disable: process.env.NODE_ENV !== 'production' || process.env.DISABLE_HMR === 'true',
      }),
    ],
    resolve: {
      dedupe: ['react', 'react-dom', 'zustand'],
      alias: [
        { find: /^react$/, replacement: path.resolve(import.meta.dirname || '.', 'node_modules/react') },
        { find: /^react\/(.*)$/, replacement: `${path.resolve(import.meta.dirname || '.', 'node_modules/react')}/$1` },
        { find: /^react-dom$/, replacement: path.resolve(import.meta.dirname || '.', 'node_modules/react-dom') },
        { find: /^react-dom\/(.*)$/, replacement: `${path.resolve(import.meta.dirname || '.', 'node_modules/react-dom')}/$1` },
        { find: /^zustand$/, replacement: path.resolve(import.meta.dirname || '.', 'node_modules/zustand') },
        { find: /^zustand\/(.*)$/, replacement: `${path.resolve(import.meta.dirname || '.', 'node_modules/zustand')}/$1` },
        {
          find: '@trampotaxa/shared/mocks',
          replacement: path.resolve(import.meta.dirname || '.', '../../packages/shared/src/mocks.ts'),
        },
        {
          find: '@trampotaxa/shared',
          replacement: path.resolve(import.meta.dirname || '.', '../../packages/shared/src/index.ts'),
        },
        { find: '@', replacement: path.resolve(import.meta.dirname || '.', '.') },
      ],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand'],
      force: true,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
