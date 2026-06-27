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
                globIgnores: ['**/blog*.png', '**/blog*.jpg', '**/pro*.png', '**/og-image*'],
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
                navigateFallback: 'index.html',
                navigateFallbackDenylist: [/^\/api/, /^\/robots\.txt/, /^\/sitemap\.xml/],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
                runtimeCaching: []
            }
        }),
        {
            name: 'inject-preload',
            transformIndexHtml: {
                order: 'post',
                handler(html, ctx) {
                    let preloadTags = '';
                    if (ctx.bundle) {
                        for (const fileName of Object.keys(ctx.bundle)) {
                            if (fileName.endsWith('.css') && fileName.includes('index-')) {
                                preloadTags += `<link rel="preload" href="/assets/${fileName.split('/').pop()}" as="style">\n    `;
                            }
                            if (fileName.endsWith('.js') && fileName.includes('index-')) {
                                preloadTags += `<link rel="preload" href="/assets/${fileName.split('/').pop()}" as="script" crossorigin="anonymous">\n    `;
                            }
                        }
                    }
                    return html.replace('</head>', `${preloadTags}</head>`);
                }
            }
        }
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
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Split framer-motion into its own chunk (largest dep)
                        if (id.includes('framer-motion')) {
                            return 'framer-motion';
                        }
                        // Split react-icons into its own chunk
                        if (id.includes('react-icons')) {
                            return 'react-icons';
                        }
                        // Everything else stays in vendor (including React core)
                        return 'vendor';
                    }
                }
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