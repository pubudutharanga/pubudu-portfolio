import { BLOG_POSTS } from '../data.js';

let cachedPosts = null;
const postCache = new Map();

/**
 * Fetch all published blog posts from MongoDB API with fallback to data.js
 */
export async function getBlogPosts({ category = 'All', search = '' } = {}) {
    try {
        if (!cachedPosts) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const res = await fetch('/api/posts', { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
                    cachedPosts = data.posts;
                }
            }
        }

        const posts = cachedPosts || BLOG_POSTS;

        return posts.filter(p => {
            const matchesCategory = category === 'All' ? true : p.category === category;
            const matchesSearch = !search ? true : (
                p.title?.toLowerCase().includes(search.toLowerCase()) ||
                p.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
                p.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            );
            return matchesCategory && matchesSearch;
        });
    } catch (err) {
        console.warn('Could not fetch from /api/posts, instantly displaying fallback posts:', err);
        return BLOG_POSTS.filter(p => {
            const matchesCategory = category === 'All' ? true : p.category === category;
            const matchesSearch = !search ? true : (
                p.title?.toLowerCase().includes(search.toLowerCase()) ||
                p.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
                p.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            );
            return matchesCategory && matchesSearch;
        });
    }
}

/**
 * Fetch a single blog post by slug or ID with full content
 */
export async function getBlogPostBySlug(slug) {
    if (!slug) return null;

    if (postCache.has(slug)) {
        return postCache.get(slug);
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
            const data = await res.json();
            if (data.success && data.post) {
                postCache.set(slug, data.post);
                return data.post;
            }
        }
    } catch (err) {
        console.warn(`Could not fetch post ${slug} from /api/posts/[slug], fallback to data.js:`, err);
    }

    // Fallback to static data.js
    const staticPost = BLOG_POSTS.find(p => p.slug === slug || p.id === slug);
    if (staticPost) {
        postCache.set(slug, staticPost);
    }
    return staticPost || null;
}
