import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';
import { BLOG_POSTS } from '../src/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

async function serveDist() {
    const app = express();
    app.use(express.static(DIST_DIR));
    app.use((req, res) => res.sendFile(path.resolve(DIST_DIR, 'index.html')));
    return new Promise((resolve) => {
        const server = app.listen(0, () => {
            resolve(server);
        });
    });
}

async function prerender() {
    console.log('🚀 Starting Prerendering for SEO...');
    let server;
    let browser;
    
    try {
        server = await serveDist();
        const port = server.address().port;
        const baseUrl = `http://localhost:${port}`;
        console.log(`Development server running at ${baseUrl}`);
        
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        // Define routes to prerender
        const routes = ['/', '/blog'];
        for (const post of BLOG_POSTS) {
            routes.push(`/blog/${post.slug || post.id}`);
        }
        
        for (const route of routes) {
            console.log(`⏳ Prerendering ${route}...`);
            const page = await browser.newPage();
            // Block unnecessary resources to speed up rendering
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });
            
            await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
            
            // Wait for main content to render
            await page.waitForSelector('#root > div', { timeout: 10000 }).catch(() => {});
            
            const html = await page.content();
            await page.close();
            
            // Save HTML
            const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
            const fullPath = path.join(DIST_DIR, routePath);
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            
            await fs.writeFile(fullPath, html);
            console.log(`✅ Saved ${routePath}`);
        }
        
    } catch (err) {
        console.error('❌ Error during prerendering:', err);
        process.exitCode = 1;
    } finally {
        if (browser) await browser.close();
        if (server) server.close();
        console.log('🎉 Prerendering complete.');
    }
}

prerender();
