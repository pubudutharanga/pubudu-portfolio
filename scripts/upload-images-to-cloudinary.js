import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '../public');

// Load .env
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

const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    MONGODB_URI,
    MONGODB_DB = 'portfolio'
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary credentials missing in .env');
    process.exit(1);
}

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
});

async function uploadLocalImage(localRelPath) {
    // Clean path like './blog1.webp' or '/PT_light.jpg'
    const filename = localRelPath.replace(/^\.?\//, '');
    const fullPath = path.join(PUBLIC_DIR, filename);

    if (!fs.existsSync(fullPath)) {
        console.warn(`  ⚠️  Local image not found at: ${fullPath}`);
        return null;
    }

    try {
        console.log(`  ☁️  Uploading ${filename} to Cloudinary...`);
        const result = await cloudinary.uploader.upload(fullPath, {
            folder: 'portfolio/blogs',
            use_filename: true,
            unique_filename: false,
            overwrite: true
        });
        console.log(`  ✅ Uploaded: ${result.secure_url}`);
        return result.secure_url;
    } catch (err) {
        console.error(`  ❌ Error uploading ${filename}:`, err.message);
        return null;
    }
}

async function run() {
    console.log('🚀 Starting Cloudinary image upload and MongoDB sync...');

    // 1. Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);
    const collection = db.collection('blogs');

    const posts = await collection.find({}).toArray();
    console.log(`📦 Found ${posts.length} posts in MongoDB.\n`);

    // Cache uploaded image URLs so we don't upload the same image twice
    const urlMap = new Map();

    for (const post of posts) {
        console.log(`📌 Processing Post: "${post.title}"`);
        const updates = {};

        // Check featured image
        if (post.featured && !post.featured.startsWith('http')) {
            if (!urlMap.has(post.featured)) {
                const cloudUrl = await uploadLocalImage(post.featured);
                if (cloudUrl) urlMap.set(post.featured, cloudUrl);
            }
            if (urlMap.has(post.featured)) {
                updates.featured = urlMap.get(post.featured);
            }
        }

        // Check author avatars
        if (post.author) {
            const authorUpdates = { ...post.author };
            if (post.author.avatarLight && !post.author.avatarLight.startsWith('http')) {
                if (!urlMap.has(post.author.avatarLight)) {
                    const cloudUrl = await uploadLocalImage(post.author.avatarLight);
                    if (cloudUrl) urlMap.set(post.author.avatarLight, cloudUrl);
                }
                if (urlMap.has(post.author.avatarLight)) {
                    authorUpdates.avatarLight = urlMap.get(post.author.avatarLight);
                }
            }

            if (post.author.avatarDark && !post.author.avatarDark.startsWith('http')) {
                if (!urlMap.has(post.author.avatarDark)) {
                    const cloudUrl = await uploadLocalImage(post.author.avatarDark);
                    if (cloudUrl) urlMap.set(post.author.avatarDark, cloudUrl);
                }
                if (urlMap.has(post.author.avatarDark)) {
                    authorUpdates.avatarDark = urlMap.get(post.author.avatarDark);
                }
            }

            updates.author = authorUpdates;
        }

        if (Object.keys(updates).length > 0) {
            await collection.updateOne({ _id: post._id }, { $set: updates });
            console.log(`  💾 Updated MongoDB document for: ${post.slug}\n`);
        } else {
            console.log(`  ⚡ No image updates needed for: ${post.slug}\n`);
        }
    }

    await client.close();
    console.log('==========================================');
    console.log('🎉 All blog images successfully migrated to Cloudinary & MongoDB updated!');
    console.log('==========================================');
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
