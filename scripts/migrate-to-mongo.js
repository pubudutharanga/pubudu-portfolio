import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { BLOG_POSTS } from '../src/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback to load .env if dotenv didn't load
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
        console.error('Warning: could not read .env manually', e);
    }
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'portfolio';

if (!uri) {
    console.error('❌ Error: MONGODB_URI is not defined in .env');
    process.exit(1);
}

async function migrate() {
    console.log('🚀 Connecting to MongoDB Atlas...');
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected successfully to MongoDB Atlas!');

        const db = client.db(dbName);
        const collection = db.collection('blogs');

        // Create indexes
        await collection.createIndex({ slug: 1 }, { unique: true });
        await collection.createIndex({ date: -1 });
        await collection.createIndex({ status: 1 });
        console.log('✅ Indexes verified on slug, date, and status.');

        console.log(`📦 Found ${BLOG_POSTS.length} posts in src/data.js. Starting migration...`);

        let inserted = 0;
        let updated = 0;

        for (const post of BLOG_POSTS) {
            const document = {
                ...post,
                status: post.status || 'published',
                createdAt: post.date ? new Date(post.date) : new Date(),
                updatedAt: new Date()
            };

            const result = await collection.updateOne(
                { slug: post.slug || post.id },
                { $set: document },
                { upsert: true }
            );

            if (result.upsertedCount > 0) {
                inserted++;
                console.log(`  ➕ Inserted: "${post.title}" (${post.slug || post.id})`);
            } else if (result.modifiedCount > 0) {
                updated++;
                console.log(`  🔄 Updated: "${post.title}" (${post.slug || post.id})`);
            } else {
                console.log(`  ⚡ Already up to date: "${post.title}"`);
            }
        }

        const totalInDb = await collection.countDocuments();
        console.log('\n==========================================');
        console.log(`🎉 Migration complete!`);
        console.log(`   New posts inserted: ${inserted}`);
        console.log(`   Existing posts updated: ${updated}`);
        console.log(`   Total posts in MongoDB: ${totalInDb}`);
        console.log('==========================================\n');

    } catch (error) {
        console.error('❌ Migration failed with error:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('🔌 Disconnected from MongoDB.');
    }
}

migrate();
