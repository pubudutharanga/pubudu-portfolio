import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary once
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export { cloudinary };

/**
 * Extract Cloudinary public_id from a full Cloudinary URL
 * @param {string} imageUrl
 * @returns {string|null}
 */
export function extractCloudinaryPublicId(imageUrl) {
    if (!imageUrl || typeof imageUrl !== 'string') return null;
    if (!imageUrl.includes('cloudinary.com')) return null;

    try {
        const urlObj = new URL(imageUrl);
        const pathname = urlObj.pathname;
        
        const uploadIndex = pathname.indexOf('/upload/');
        if (uploadIndex === -1) return null;

        let afterUpload = pathname.substring(uploadIndex + '/upload/'.length);
        const segments = afterUpload.split('/');
        
        while (segments.length > 0) {
            const first = segments[0];
            // Remove version (v123456) or transformation params (w_500, c_scale, etc.)
            if (/^v\d+$/.test(first) || /^(w_|h_|c_|q_|f_|b_|e_|l_|o_|r_|a_|fl_|pg_|t_)/.test(first) || first.includes(',')) {
                segments.shift();
            } else {
                break;
            }
        }

        if (segments.length === 0) return null;

        const fullPath = segments.join('/');
        const lastDotIndex = fullPath.lastIndexOf('.');
        const publicId = lastDotIndex !== -1 ? fullPath.substring(0, lastDotIndex) : fullPath;

        return decodeURIComponent(publicId);
    } catch (err) {
        console.error('Error extracting Cloudinary public_id:', err);
        return null;
    }
}

/**
 * Delete one or more images from Cloudinary by URL or public_id
 * @param {string|string[]} imageSources
 * @returns {Promise<Array<{publicId: string, status: string, error?: string}>>}
 */
export async function deleteCloudinaryImages(imageSources) {
    if (!imageSources) return [];
    const sources = Array.isArray(imageSources) ? imageSources : [imageSources];
    const publicIds = new Set();

    for (const src of sources) {
        if (!src) continue;
        const publicId = src.includes('cloudinary.com') ? extractCloudinaryPublicId(src) : src;
        if (publicId) {
            publicIds.add(publicId);
        }
    }

    if (publicIds.size === 0) return [];

    if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn('Cloudinary credentials not configured. Skipping image deletion.');
        return Array.from(publicIds).map(id => ({ publicId: id, status: 'skipped', reason: 'no_credentials' }));
    }

    const results = [];
    for (const publicId of publicIds) {
        try {
            const res = await cloudinary.uploader.destroy(publicId, {
                invalidate: true,
                resource_type: 'image'
            });
            results.push({ publicId, status: res.result || 'ok' });
            console.log(`[Cloudinary] Successfully deleted image: ${publicId} (result: ${res.result})`);
        } catch (err) {
            console.error(`[Cloudinary] Failed to delete asset ${publicId}:`, err);
            results.push({ publicId, status: 'error', error: err.message });
        }
    }

    return results;
}
