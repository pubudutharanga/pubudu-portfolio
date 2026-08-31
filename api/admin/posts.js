import { getDatabase } from '../lib/mongodb.js';
import { requireAdminSession } from '../lib/auth.js';
import { PostInputSchema } from '../lib/schemas.js';
import { sanitizePostHtml } from '../lib/sanitize.js';
import { deleteCloudinaryImages } from '../lib/cloudinary.js';

/**
 * Generate a guaranteed unique slug (Fixes H3)
 */
async function generateUniqueSlug(collection, baseSlug, excludeId = null) {
    let cleanSlug = baseSlug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    if (!cleanSlug) cleanSlug = `post-${Date.now()}`;

    let candidate = cleanSlug;
    let counter = 1;

    while (true) {
        const query = { slug: candidate };
        if (excludeId) {
            query.id = { $ne: excludeId };
        }

        const existing = await collection.findOne(query, { projection: { _id: 1 } });
        if (!existing) {
            return candidate;
        }

        counter++;
        candidate = `${cleanSlug}-${counter}`;
    }
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 1. Enforce authentication
        requireAdminSession(req);

        const db = await getDatabase();
        const collection = db.collection('blogs');

        // ----------------------------------------------------
        // GET /api/admin/posts (List with pagination & filters)
        // ----------------------------------------------------
        if (req.method === 'GET') {
            const {
                category,
                status,
                search,
                page = 1,
                limit = 20,
                full = false
            } = req.query;

            const query = {
                deletedAt: { $exists: false } // filter out soft-deleted
            };

            if (status && status !== 'all') {
                query.status = status;
            }

            if (category && category !== 'All') {
                query.category = category;
            }

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { slug: { $regex: search, $options: 'i' } },
                    { excerpt: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ];
            }

            const pageNum = Math.max(parseInt(page, 10) || 1, 1);
            const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
            const skip = (pageNum - 1) * limitNum;

            // Projection: omit heavy content in list view unless requested
            const projection = full === 'true' ? {} : { revisions: 0 };

            const total = await collection.countDocuments(query);
            const totalPublished = await collection.countDocuments({ status: 'published', deletedAt: { $exists: false } });
            const totalDrafts = await collection.countDocuments({ status: 'draft', deletedAt: { $exists: false } });

            const posts = await collection
                .find(query, { projection })
                .sort({ date: -1, createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .toArray();

            return res.status(200).json({
                success: true,
                posts,
                pagination: {
                    total,
                    totalPublished,
                    totalDrafts,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                }
            });
        }

        // ----------------------------------------------------
        // POST /api/admin/posts (Create new post)
        // ----------------------------------------------------
        if (req.method === 'POST') {
            const parsed = PostInputSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
                });
            }

            const data = parsed.data;
            const uniqueSlug = await generateUniqueSlug(collection, data.slug || data.title);
            const sanitizedHtml = sanitizePostHtml(data.content);

            const now = new Date();
            const dateStr = data.date || now.toISOString().split('T')[0];

            const author = data.author || {
                name: 'Pubudu Tharanga',
                avatarLight: '/PT_light.jpg',
                avatarDark: '/PT.jpg'
            };

            const newPost = {
                id: data.id || `b_${Date.now()}`,
                slug: uniqueSlug,
                title: data.title,
                category: data.category || 'Industry Insights',
                excerpt: data.excerpt || '',
                readTime: data.readTime || '5 min read',
                date: dateStr,
                featured: data.featured || '/blog1.webp',
                tags: data.tags || [],
                author,
                content: sanitizedHtml,
                status: data.status || 'published',
                source: data.source || 'manual',
                seo: data.seo || {},
                revisions: [
                    {
                        date: now,
                        action: 'created',
                        status: data.status || 'published'
                    }
                ],
                createdAt: now,
                updatedAt: now
            };

            await collection.insertOne(newPost);

            return res.status(201).json({
                success: true,
                message: 'Post created successfully',
                post: newPost
            });
        }

        // ----------------------------------------------------
        // PUT /api/admin/posts (Update existing post)
        // ----------------------------------------------------
        if (req.method === 'PUT') {
            const { id, slug, ...updateFields } = req.body || {};

            if (!id && !slug) {
                return res.status(400).json({ success: false, error: 'Post ID or Slug is required for update' });
            }

            const query = id ? { id } : { slug };
            const existingPost = await collection.findOne(query);

            if (!existingPost) {
                return res.status(404).json({ success: false, error: 'Post not found' });
            }

            const updates = { ...updateFields, updatedAt: new Date() };
            delete updates._id;
            delete updates.id;

            // Sanitize HTML if content was updated
            if (updates.content) {
                updates.content = sanitizePostHtml(updates.content);
            }

            // Save revision history (Fixes M5)
            const revisions = existingPost.revisions || [];
            if (existingPost.content && updates.content && updates.content !== existingPost.content) {
                revisions.unshift({
                    content: existingPost.content,
                    editedAt: new Date()
                });
                // Keep last 5 revisions
                updates.revisions = revisions.slice(0, 5);
            }

            updates.updatedAt = new Date();

            const result = await collection.findOneAndUpdate(
                query,
                { $set: updates },
                { returnDocument: 'after' }
            );

            return res.status(200).json({
                success: true,
                message: 'Post updated successfully',
                post: result
            });
        }

        // ----------------------------------------------------
        // DELETE /api/admin/posts (Delete post & thumbnail/images from Cloudinary)
        // ----------------------------------------------------
        if (req.method === 'DELETE') {
            const id = req.body?.id || req.query?.id;
            const slug = req.body?.slug || req.query?.slug;
            const hard = req.body?.hard ?? req.query?.hard ?? true;
            if (!id && !slug) {
                return res.status(400).json({ success: false, error: 'Post id or slug is required for deletion' });
            }

            let query = {};
            if (slug) {
                query = { slug };
            } else if (id) {
                // If it's a 24-char hex string, it might be an ObjectId, but let's just search by `id` string for safety
                // since our app explicitly stores a string `id` field.
                query = { id };
            }

            // 1. Locate existing post to inspect its assets
            const existingPost = await collection.findOne(query);
            if (!existingPost) {
                return res.status(404).json({ success: false, error: 'Post not found' });
            }

            // 2. Identify Cloudinary images associated with this post (thumbnail & inline images)
            const imagesToDelete = [];

            // Thumbnail / Featured image
            if (existingPost.featured && existingPost.featured.includes('cloudinary.com')) {
                imagesToDelete.push(existingPost.featured);
            }

            // SEO OG image if different from featured
            if (existingPost.seo?.ogImage && existingPost.seo.ogImage.includes('cloudinary.com') && existingPost.seo.ogImage !== existingPost.featured) {
                imagesToDelete.push(existingPost.seo.ogImage);
            }

            // Inline uploaded images in article content
            if (existingPost.content) {
                const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
                let match;
                while ((match = imgRegex.exec(existingPost.content)) !== null) {
                    const src = match[1];
                    if (src && src.includes('cloudinary.com')) {
                        imagesToDelete.push(src);
                    }
                }
            }

            // 3. Delete thumbnail and article images from Cloudinary
            let cloudinaryDeletions = [];
            if (imagesToDelete.length > 0) {
                cloudinaryDeletions = await deleteCloudinaryImages(imagesToDelete);
            }

            // 4. Delete the article from MongoDB
            const deleteResult = await collection.deleteOne(query);

            return res.status(200).json({
                success: true,
                message: 'Post and thumbnail deleted successfully from MongoDB and Cloudinary',
                deletedCount: deleteResult.deletedCount,
                cloudinaryDeletions
            });
        }

        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    } catch (error) {
        console.error('API /api/admin/posts error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}
