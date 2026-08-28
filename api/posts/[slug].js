import { getDatabase } from '../lib/mongodb.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        const { slug } = req.query;

        if (!slug) {
            return res.status(400).json({ success: false, error: 'Missing slug parameter' });
        }

        const db = await getDatabase();
        const collection = db.collection('blogs');

        const post = await collection.findOne({
            $or: [
                { slug: slug },
                { id: slug }
            ]
        });

        if (!post) {
            return res.status(404).json({ success: false, error: 'Blog post not found' });
        }

        // Cache on CDN edge for 60 seconds, stale-while-revalidate for 5 mins
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error('API /api/posts/[slug] error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}
