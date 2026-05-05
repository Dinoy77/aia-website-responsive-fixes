import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: process.cwd(),
  base: "/",
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [
          // Remove console.* in production
          ["babel-plugin-transform-remove-console", { exclude: ["error", "warn"] }]
        ]
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer', // FIX: was blocking — now deferred
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'android-chrome-192x192.png'],
      manifest: {
        name: 'AIA Website',
        short_name: 'AIA',
        description: 'AIA Website with offline capabilities',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          { src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        // FIX: Skip the huge vendor chunk from SW precache to reduce initial load
        globIgnores: ['assets/vendor-*.js'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/aia\.in\.net\/webapi\/public\/assets\/images\/web_images\/banner_images\/.*\.webp$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'remote-banner-images',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/aia\.in\.net\/webapi\/public\/api\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),

    viteCompression({ algorithm: "gzip", ext: ".gz" }),
    viteCompression({ algorithm: "brotliCompress", ext: ".br" }),
  ],

  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    target: "esnext",
    cssCodeSplit: true,
    minify: "esbuild",
    sourcemap: false,

    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("/node_modules/react/") ||
              id.includes("/node_modules/react-dom/") ||
              id.includes("/node_modules/react-router-dom/") ||
              id.includes("/node_modules/scheduler/")
            ) return "react-vendor";
            if (id.includes("axios") || id.includes("@tanstack/react-query")) return "data-vendor";
            if (id.includes("framer-motion")) return "framer-motion";
            if (id.includes("lucide-react") || id.includes("react-icons")) return "icons-vendor";
            // FIX: Split leaflet into its own chunk — only loads on map pages
            if (id.includes("leaflet") || id.includes("react-leaflet")) return "map-vendor";
            if (id.includes("swiper") || id.includes("embla-carousel")) return "carousel-vendor";
            if (id.includes("@radix-ui")) return "radix-vendor";
            return "vendor";
          }
        },
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
  },
});