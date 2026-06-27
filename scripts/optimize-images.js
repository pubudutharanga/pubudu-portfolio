import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = './public';

// Images to convert to WebP (skip PTb.png per user request)
const CONVERT_TO_WEBP = [
    { file: 'blog3.png', maxWidth: 1200, quality: 80 },
    { file: 'blog4.png', maxWidth: 1200, quality: 80 },
    { file: 'blog1.jpg', maxWidth: 1200, quality: 80 },
    { file: 'blog2.png', maxWidth: 1200, quality: 80 },
    { file: 'blog6.png', maxWidth: 800, quality: 80 },
    { file: 'pro4.jpg', maxWidth: 800, quality: 80 },
];

async function getFileSize(filePath) {
    const s = await stat(filePath);
    return s.size;
}

async function optimizeImages() {
    console.log('🖼️  Starting image optimization...\n');

    for (const { file, maxWidth, quality } of CONVERT_TO_WEBP) {
        const inputPath = join(PUBLIC_DIR, file);
        const outputName = basename(file, extname(file)) + '.webp';
        const outputPath = join(PUBLIC_DIR, outputName);

        try {
            const originalSize = await getFileSize(inputPath);

            await sharp(inputPath)
                .resize({ width: maxWidth, withoutEnlargement: true })
                .webp({ quality })
                .toFile(outputPath);

            const newSize = await getFileSize(outputPath);
            const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

            console.log(`✅ ${file} → ${outputName}`);
            console.log(`   ${(originalSize / 1024).toFixed(1)} KB → ${(newSize / 1024).toFixed(1)} KB (${savings}% smaller)\n`);
        } catch (err) {
            console.error(`❌ Failed to convert ${file}:`, err.message);
        }
    }

    console.log('✨ Image optimization complete!');
}

optimizeImages();
