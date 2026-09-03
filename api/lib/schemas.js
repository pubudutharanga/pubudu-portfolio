import { z } from 'zod';

/**
 * Validates AI-generated blog output from Gemini model
 */
export const AiBlogResponseSchema = z.object({
    title: z.string().min(5).max(200),
    slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens'),
    category: z.string().min(2).max(100),
    excerpt: z.string().min(10).max(500),
    readTime: z.string().min(3).max(30).default('5 min read'),
    tags: z.array(z.string()).min(1).max(10),
    content: z.string().min(100)
});

/**
 * Validates AI-generated Sinhala LinkedIn post output
 */
export const AiLinkedInResponseSchema = z.object({
    sinhalaPost: z.string().min(50),
    hook: z.string().optional(),
    hashtags: z.array(z.string()).optional()
});

/**
 * Validates blog post creation/update payload from Admin Dashboard
 */
export const PostInputSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3, 'Title must be at least 3 characters').max(250),
    slug: z.string().min(3).max(250).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    category: z.string().default('Industry Insights'),
    excerpt: z.string().max(600).default(''),
    readTime: z.string().default('5 min read'),
    date: z.string().optional(),
    featured: z.string().url('Featured image must be a valid URL').or(z.string().startsWith('/')),
    tags: z.array(z.string()).default([]),
    content: z.string().min(10, 'Content must not be empty'),
    status: z.enum(['published', 'draft']).default('published'),
    source: z.enum(['ai', 'manual']).default('manual'),
    author: z.object({
        name: z.string().default('Pubudu Tharanga'),
        avatarLight: z.string().default('/PT_light.jpg'),
        avatarDark: z.string().default('/PT.jpg'),
        role: z.string().optional()
    }).optional(),
    seo: z.object({
        metaDescription: z.string().max(200).optional(),
        ogImage: z.string().optional(),
        canonicalUrl: z.string().optional(),
        keywords: z.array(z.string()).optional()
    }).optional()
});

/**
 * Validates Login payload
 */
export const LoginInputSchema = z.object({
    password: z.string().min(1, 'Password is required')
});
