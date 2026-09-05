import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import 'dotenv/config'
import url from 'url'
import path from 'path'


// Vite local API dev middleware plugin
function vercelApiDevPlugin() {
    return {
        name: 'vercel-api-dev-plugin',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url.startsWith('/api/')) {
                    return next();
                }

                // Dynamically reload .env on local requests so env changes are picked up without restarting
                const dotenv = await import('dotenv');
                dotenv.config({ override: true });

                try {
                    const parsedUrl = url.parse(req.url, true);
                    const pathname = parsedUrl.pathname;

                    let filePath = null;
                    if (pathname === '/api/posts') {
                        filePath = './api/posts/index.js';
                    } else if (pathname.startsWith('/api/posts/')) {
                        filePath = './api/posts/[slug].js';
                        const slug = pathname.replace('/api/posts/', '');
                        req.query = { ...parsedUrl.query, slug };
                    } else if (pathname === '/api/admin/auth') {
                        filePath = './api/admin/auth.js';
                    } else if (pathname === '/api/admin/logout') {
                        filePath = './api/admin/logout.js';
                    } else if (pathname === '/api/admin/upload-signature') {
                        filePath = './api/admin/upload-signature.js';
                    } else if (pathname === '/api/admin/generate') {
                        filePath = './api/admin/generate.js';
                    } else if (pathname === '/api/admin/posts') {
                        filePath = './api/admin/posts.js';
                    }

                    if (!filePath) {
                        return next();
                    }

                    // Parse request body for POST/PUT/DELETE
                    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                        const buffers = [];
                        for await (const chunk of req) {
                            buffers.push(chunk);
                        }
                        const rawBody = Buffer.concat(buffers).toString('utf-8');
                        if (rawBody) {
                            try {
                                req.body = JSON.parse(rawBody);
                            } catch (e) {
                                req.body = rawBody;
                            }
                        } else {
                            req.body = {};
                        }
                    }

                    req.query = req.query || parsedUrl.query;

                    // Mock Vercel response helper
                    res.status = (statusCode) => {
                        res.statusCode = statusCode;
                        return res;
                    };
                    res.json = (data) => {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(data));
                        return res;
                    };

                    const absolutePath = path.resolve(process.cwd(), filePath);
                    const fileUrl = url.pathToFileURL(absolutePath).href;
                    const module = await import(`${fileUrl}?t=${Date.now()}`);
                    const handler = module.default;
                    await handler(req, res);
                } catch (error) {
                    console.error('Vite API Dev Server Error:', error.message || error);
                    if (!res.writableEnded) {
                        const statusCode = error.statusCode || 500;
                        res.statusCode = statusCode;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: false, error: error.message }));
                    }
                }
            });
        }
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vercelApiDevPlugin(),
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
                    let noscriptTags = '<noscript>';
                    if (ctx.bundle) {
                        for (const fileName of Object.keys(ctx.bundle)) {
                            if (fileName.endsWith('.js') && fileName.includes('index-')) {
                                preloadTags += `<link rel="preload" href="/assets/${fileName.split('/').pop()}" as="script" crossorigin="anonymous">\n    `;
                            }
                            if (fileName.endsWith('.css') && fileName.includes('index-')) {
                                preloadTags += `<link rel="preload" href="/assets/${fileName.split('/').pop()}" as="style">\n    `;
                                noscriptTags += `<link rel="stylesheet" crossorigin href="/assets/${fileName.split('/').pop()}">`;
                            }
                        }
                    }
                    noscriptTags += '</noscript>\n';
                    
                    // Defer all synchronous CSS loading using media="print" trick
                    let modifiedHtml = html.replace(
                        /<link rel="stylesheet"(.*?)>/g, 
                        '<link rel="stylesheet"$1 media="print" onload="this.media=\'all\'">'
                    );
                    
                    return modifiedHtml.replace('</head>', `${noscriptTags}${preloadTags}</head>`);
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