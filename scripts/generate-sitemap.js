import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BLOG_POSTS, SITE } from '../src/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

const BASE_URL = SITE.siteUrl.replace(/\/$/, '');

const STATIC_ROUTES = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/blog', changefreq: 'weekly', priority: 0.9 },
    // Add other static pages here if necessary
];

function formatDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    return new Date(dateString).toISOString().split('T')[0];
}

function generateSitemap() {
    console.log('🚀 Generating sitemap...');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add Static Routes
    STATIC_ROUTES.forEach(route => {
        xml += `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${formatDate()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`;
    });

    // Add Dynamic Blog Posts
    BLOG_POSTS.forEach(post => {
        xml += `
  <url>
    <loc>${BASE_URL}/blog/${post.id}</loc>
    <lastmod>${formatDate(post.date)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log(`✅ Sitemap generated successfully at ${SITEMAP_PATH}`);
    console.log(`   Total URLs: ${STATIC_ROUTES.length + BLOG_POSTS.length}`);
}

try {
    generateSitemap();
} catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
}
