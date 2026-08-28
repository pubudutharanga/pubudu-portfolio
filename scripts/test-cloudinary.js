import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

console.log('Testing Cloudinary credentials:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret length:', process.env.CLOUDINARY_API_SECRET?.length);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

async function test() {
    try {
        const ping = await cloudinary.api.ping();
        console.log('✅ Cloudinary Ping successful:', ping);

        const imgPath = path.join(__dirname, '../public/blog1.webp');
        console.log('Testing upload of:', imgPath);
        const res = await cloudinary.uploader.upload(imgPath, {
            folder: 'portfolio/blogs'
        });
        console.log('✅ Upload test success:', res.secure_url);
    } catch (err) {
        console.error('❌ Upload error details:');
        console.error('Message:', err.message);
        console.error('HTTP code:', err.http_code);
        console.error('Full Error:', JSON.stringify(err, null, 2));
    }
}

test();
