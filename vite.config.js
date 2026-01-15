import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            // React 19 compatibility
            jsxRuntime: 'automatic',
        })
    ],
    base: '/pubudu-portfolio',
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
    css: {
        postcss: './postcss.config.js',
    },
})