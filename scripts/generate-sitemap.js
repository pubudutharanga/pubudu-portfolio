import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { BLOG_POSTS, SITE } from '../src/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

const BASE_URL = SITE.siteUrl.replace(/\/$/, '');

const STATIC_ROUTES = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/blog', changefreq: 'weekly', priority: 0.9 },
];

function formatDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    return new Date(dateString).toISOString().split('T')[0];
}

// Fallback to load .env if not loaded
if (!process.env.MONGODB_URI) {
    try {
        const envPath = path.join(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1];
                    const value = match[2] ? match[2].trim().replace(/^['"]|['"]$/g, '') : '';
                    process.env[key] = value;
                }
            });
        }
    } catch (e) {
        // silent
    }
}

async function getPosts() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || 'portfolio';

    if (uri) {
        try {
            const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
            await client.connect();
            const db = client.db(dbName);
            const posts = await db.collection('blogs')
                .find({ status: { $ne: 'draft' } }, { projection: { slug: 1, id: 1, date: 1 } })
                .toArray();
            await client.close();
            if (posts && posts.length > 0) {
                console.log(`📡 Loaded ${posts.length} posts from MongoDB for sitemap.`);
                return posts;
            }
        } catch (err) {
            console.warn('⚠️  Could not connect to MongoDB for sitemap, falling back to data.js:', err.message);
        }
    }
    return BLOG_POSTS;
}

async function generateSitemap() {
    console.log('🚀 Generating sitemap...');

    const posts = await getPosts();

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
    posts.forEach(post => {
        xml += `
  <url>
    <loc>${BASE_URL}/blog/${post.slug || post.id}</loc>
    <lastmod>${formatDate(post.date)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log(`✅ Sitemap generated successfully at ${SITEMAP_PATH}`);
    console.log(`   Total URLs: ${STATIC_ROUTES.length + posts.length}`);
}

generateSitemap().catch(error => {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
});
