import { getDatabase } from '../lib/mongodb.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const db = await getDatabase();
        const collection = db.collection('blogs');

        // GET: Fetch all posts
        if (req.method === 'GET') {
            const { category, search, limit = 50, page = 1, full = false } = req.query;

            const query = {
                status: { $ne: 'draft' }
            };

            if (category && category !== 'All') {
                query.category = category;
            }

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { excerpt: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ];
            }

            const limitNum = Math.min(parseInt(limit, 10) || 50, 100);
            const pageNum = Math.max(parseInt(page, 10) || 1, 1);
            const skip = (pageNum - 1) * limitNum;

            // Projection: omit full HTML content in list view for super-fast payload unless requested
            const projection = full === 'true' ? {} : { content: 0 };

            const total = await collection.countDocuments(query);
            const posts = await collection
                .find(query, { projection })
                .sort({ date: -1, createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .toArray();

            // Set Edge caching headers
            res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
            return res.status(200).json({
                success: true,
                total,
                page: pageNum,
                limit: limitNum,
                posts
            });
        }

        // POST: Create or update post (Webhook from n8n)
        if (req.method === 'POST') {
            const authHeader = req.headers.authorization;
            const secretKey = process.env.API_SECRET_KEY;

            if (!secretKey) {
                return res.status(500).json({
                    success: false,
                    error: 'API_SECRET_KEY is not configured on the server.'
                });
            }

            // Verify bearer token
            const token = authHeader && authHeader.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : null;

            if (!token || token !== secretKey) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized: Invalid or missing API secret token.'
                });
            }

            const postData = req.body;
            if (!postData || (!postData.title && !postData.slug)) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required post title or slug.'
                });
            }

            // Generate slug if not provided
            const slug = (postData.slug || postData.title)
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-');

            const now = new Date();
            const dateStr = postData.date || now.toISOString().split('T')[0];

            const author = postData.author || {
                name: 'Pubudu Tharanga',
                avatarLight: '/PT_light.jpg',
                avatarDark: '/PT.jpg'
            };

            const blogDoc = {
                id: postData.id || `b_${Date.now()}`,
                slug,
                title: postData.title,
                category: postData.category || 'Industry Insights',
                excerpt: postData.excerpt || '',
                readTime: postData.readTime || '5 min read',
                date: dateStr,
                featured: postData.featured || '/blog1.webp',
                tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags ? postData.tags.split(',').map(t => t.trim()) : []),
                author,
                content: postData.content || '',
                status: postData.status || 'published',
                createdAt: postData.createdAt ? new Date(postData.createdAt) : now,
                updatedAt: now
            };

            const result = await collection.updateOne(
                { slug },
                { $set: blogDoc },
                { upsert: true }
            );

            return res.status(200).json({
                success: true,
                message: result.upsertedCount > 0 ? 'Blog post published' : 'Blog post updated',
                slug,
                post: blogDoc
            });
        }

        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    } catch (error) {
        console.error('API /api/posts error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}
