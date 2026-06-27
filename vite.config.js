import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            // React 19 compatibility
            jsxRuntime: 'automatic',
        }),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: null,
            includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'site.webmanifest'],
            // Use existing site.webmanifest instead of generating a new one
            manifest: false,
            strategies: 'generateSW',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
                // Exclude large images from precaching - they'll be loaded on-demand
                globIgnores: ['**/blog*.png', '**/blog*.jpg', '**/pro*.png', '**/og-image*'],
                // Increase limit for other assets
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
                navigateFallback: 'index.html',
                navigateFallbackDenylist: [/^\/api/, /^\/robots\.txt/, /^\/sitemap\.xml/],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
                runtimeCaching: []
            }
        })
    ],
    base: '/',
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'router-vendor': ['react-router-dom', 'react-router-hash-link'],
                    'animation-vendor': ['framer-motion'],
                },
            },
        },
        cssCodeSplit: true,
    },
    server: {
        port: 3000,
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    },

})