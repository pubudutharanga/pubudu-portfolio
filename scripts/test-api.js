import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback to load .env
if (!process.env.MONGODB_URI) {
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
}

import handler from '../api/posts/index.js';
import slugHandler from '../api/posts/[slug].js';

async function test() {
    console.log('🧪 Testing /api/posts handler locally...');

    // 1. Test GET list
    const mockReqGet = {
        method: 'GET',
        query: { limit: '3' },
        headers: {}
    };

    let getResult = null;
    const mockResGet = {
        setHeader: () => {},
        status: (code) => ({
            json: (data) => {
                getResult = { code, data };
                return data;
            },
            end: () => {}
        })
    };

    await handler(mockReqGet, mockResGet);
    console.log(`✅ GET /api/posts status ${getResult.code}. Total posts: ${getResult.data.total}, returned: ${getResult.data.posts.length}`);

    // 2. Test GET by slug
    const firstSlug = getResult.data.posts[0].slug;
    const mockReqSlug = {
        method: 'GET',
        query: { slug: firstSlug },
        headers: {}
    };

    let slugResult = null;
    const mockResSlug = {
        setHeader: () => {},
        status: (code) => ({
            json: (data) => {
                slugResult = { code, data };
                return data;
            },
            end: () => {}
        })
    };

    await slugHandler(mockReqSlug, mockResSlug);
    console.log(`✅ GET /api/posts/[slug] for "${firstSlug}" returned title: "${slugResult.data.post?.title}"`);

    console.log('\n🎉 Local API serverless function verification successful!');
    process.exit(0);
}

test().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
