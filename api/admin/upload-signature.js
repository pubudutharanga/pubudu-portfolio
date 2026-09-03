import { cloudinary } from '../lib/cloudinary.js';
import { requireAdminSession } from '../lib/auth.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        // 1. Enforce admin authentication
        requireAdminSession(req);

        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

        if (!apiSecret || !apiKey || !cloudName) {
            return res.status(500).json({
                success: false,
                error: 'Cloudinary credentials are not configured on the server.'
            });
        }

        // 2. Generate short-lived timestamp and signature params
        const timestamp = Math.round(Date.now() / 1000);
        const folder = req.body?.folder || 'portfolio/blogs';
        
        const paramsToSign = {
            timestamp,
            folder
        };

        const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

        // 3. Return signature metadata to browser for direct client-side upload
        return res.status(200).json({
            success: true,
            signature,
            timestamp,
            folder,
            apiKey,
            cloudName
        });
    } catch (error) {
        console.error('API /api/admin/upload-signature error:', error);
        return res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}
