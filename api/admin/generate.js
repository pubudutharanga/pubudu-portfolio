import { requireAdminSession } from '../lib/auth.js';
import { AiBlogResponseSchema, AiLinkedInResponseSchema } from '../lib/schemas.js';
import { sanitizePostHtml } from '../lib/sanitize.js';

// Reads model from env with fallback to latest active Gemini models
const FALLBACK_MODELS = ['gemini-3.7-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];


/**
 * Robust fetch with timeout & bounded exponential backoff retry (Fixes H4)
 */
async function fetchGeminiWithRetry(endpoint, body, maxRetries = 2, timeoutMs = 45000) {
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                return await response.json();
            }

            const errorData = await response.json().catch(() => ({}));
            const errMsg = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(`Gemini API error: ${errMsg}`);
        } catch (err) {
            clearTimeout(timeoutId);
            lastError = err;
            if (attempt < maxRetries) {
                const backoff = Math.pow(2, attempt) * 1000;
                await new Promise((resolve) => setTimeout(resolve, backoff));
            }
        }
    }

    throw lastError;
}

/**
 * Call Gemini API across models with strict schema enforcement
 */
async function callGemini(apiKey, systemPrompt, userPrompt, responseSchema = null) {
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.7-flash';
    const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter(m => m !== primaryModel)];
    let lastErr = null;

    for (const modelName of modelsToTry) {
        // Strip 'models/' prefix if provided
        const cleanModel = modelName.replace(/^models\//, '');
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

        const generationConfig = {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json'
        };

        if (responseSchema) {
            generationConfig.responseSchema = responseSchema;
        }

        const payload = {
            contents: [
                {
                    parts: [
                        { text: systemPrompt + '\n\n' + userPrompt }
                    ]
                }
            ],
            generationConfig
        };

        try {
            const data = await fetchGeminiWithRetry(endpoint, payload);
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!textResponse) {
                throw new Error('Empty response received from Gemini model');
            }
            return textResponse;
        } catch (err) {
            lastErr = err;
            // If model not found or deprecated, try next in list
            if (err.message.includes('not found') || err.message.includes('deprecated') || err.message.includes('404')) {
                console.warn(`Model ${cleanModel} failed, trying fallback model...`);
                continue;
            }
            throw err;
        }
    }

    throw lastErr;
}

/**
 * Pure HTML extractor that guarantees NO raw JSON wrapper ever leaks into blog content
 */
function cleanContentHtml(rawContent) {
    if (!rawContent || typeof rawContent !== 'string') {
        return '<p>No content generated.</p>';
    }

    let html = rawContent.trim();

    // If the content string accidentally contains the entire raw JSON object
    if (html.startsWith('{') && html.includes('"content"')) {
        const contentMatch = html.match(/"content"\s*:\s*"([\s\S]*)/);
        if (contentMatch) {
            let inner = contentMatch[1];
            // Remove trailing quote/brace
            inner = inner.replace(/"\s*\}\s*$/, '');
            html = inner;
        } else {
            // Strip everything up to the first < tag
            const firstTag = html.indexOf('<');
            if (firstTag !== -1) {
                html = html.substring(firstTag);
            }
        }
    }

    // Strip leading JSON artifacts like { "title": "...", "content": "
    html = html.replace(/^\{[\s\S]*?"content"\s*:\s*"/i, '');
    html = html.replace(/"\s*\}\s*$/i, '');

    // Unescape escaped quotes and newlines if they are literal escapes
    if (html.includes('\\"') || html.includes('\\n')) {
        html = html
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\');
    }

    // Ensure it starts cleanly with HTML
    const firstTagIdx = html.indexOf('<');
    if (firstTagIdx > 0 && !html.substring(0, firstTagIdx).includes('>')) {
        html = html.substring(firstTagIdx);
    }

    return html.trim();
}

/**
 * Resilient JSON parser that sanitizes unescaped control characters & bad backslashes from LLM output
 */
function robustJsonParse(raw) {
    if (!raw || typeof raw !== 'string') {
        throw new Error('Empty response from model');
    }

    let cleaned = raw.trim();

    // 1. Strip markdown fences
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // 2. Extract substring between first { and last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    let parsed = null;

    // 3. Try standard parse first
    try {
        parsed = JSON.parse(cleaned);
    } catch (e1) {
        // 4. Sanitize unescaped control characters (raw newlines, tabs) and backslashes
        try {
            const sanitized = cleaned
                .replace(/[\u0000-\u001F]+/g, (match) => {
                    if (match.includes('\n')) return '\\n';
                    if (match.includes('\r')) return '\\r';
                    if (match.includes('\t')) return '\\t';
                    return ' ';
                })
                .replace(/\\(?!["\\/bfnrtu]|u[0-9a-fA-F]{4})/g, '\\\\');

            parsed = JSON.parse(sanitized);
        } catch (e2) {
            // 5. Fail-safe field regex extraction
            const titleMatch = cleaned.match(/"title"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
            const slugMatch = cleaned.match(/"slug"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
            const categoryMatch = cleaned.match(/"category"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
            const excerptMatch = cleaned.match(/"excerpt"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
            const readTimeMatch = cleaned.match(/"readTime"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
            
            parsed = {
                title: titleMatch ? titleMatch[1].replace(/\\"/g, '"') : 'Untitled Post',
                slug: slugMatch ? slugMatch[1].toLowerCase().replace(/[^a-z0-9-]/g, '-') : `post-${Date.now()}`,
                category: categoryMatch ? categoryMatch[1].replace(/\\"/g, '"') : 'Industry Insights',
                excerpt: excerptMatch ? excerptMatch[1].replace(/\\"/g, '"') : '',
                readTime: readTimeMatch ? readTimeMatch[1].replace(/\\"/g, '"') : '8 min read',
                tags: ['AI Automation', 'Web Development'],
                content: cleanContentHtml(cleaned)
            };
        }
    }

    // Clean and sanitize the content field
    if (parsed && parsed.content) {
        parsed.content = cleanContentHtml(parsed.content);
    }

    return parsed;
}


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
        // 1. Enforce authentication
        requireAdminSession(req);

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: 'GEMINI_API_KEY is not configured in server environment.'
            });
        }

        const { type = 'blog', topic, category, audience, postData, customNotes } = req.body || {};

        // ----------------------------------------------------
        // TYPE: BLOG GENERATION (English Technical Article)
        // ----------------------------------------------------
        if (type === 'blog') {
            if (!topic || topic.trim().length < 3) {
                return res.status(400).json({
                    success: false,
                    error: 'Topic is required and must be at least 3 characters.'
                });
            }

            const isBeginner = audience ? audience.toLowerCase().includes('beginner') : false;

            const systemPrompt = isBeginner
                ? `You are a world-class technology author, viral tech blogger, and thought leader writing for Pubudu Tharanga's developer portfolio.
Write an extraordinarily engaging, fascinating, and high-retention blog post tailored for a BEGINNER TO INTERMEDIATE audience.

🎯 TITLE & HEADLINE RULES (MANDATORY):
- The title MUST be NATURAL, PUNCHY, and EYE-CATCHING (High-CTR, human-written, engaging).
- AVOID robotic, overused clichés like "Demystifying...", "A Comprehensive Guide to...", "Understanding the Basics of...".
- Use magnetic, modern formats such as:
  * "Why [Topic] Is Changing Everything in 2026 (And What You Need to Know)"
  * "The Real Reason [Topic] Matters: A Practical Look Behind the Hype"
  * "Stop Doing [Old Way]: How [Topic] Transforms Modern Workflows"
  * "What Nobody Tells You About [Topic] (Explained Simply)"
  * "[Topic] in 2026: The Essential Concepts That Actually Matter"

Core Guidelines for Beginner to Intermediate:
1. STRICT CONSTRAINT: DO NOT include code snippets, complex programming syntax, or raw code blocks.
2. Focus on making the article exciting, intuitive, and enjoyable to read. Explain core concepts, mental models, real-world analogies, and the practical "why" behind the technology.
3. Length Requirement: The article MUST be comprehensive, detailed, and rich enough for a genuine **8 min read** (1500 to 2000 words). Thoroughly explore the topic across 5–7 structured sub-sections.
4. Rich Visual UI Components to include in the semantic HTML:
   - High-interest Lead paragraph: <p class="lead dark:text-gray-300">...
   - Engaging Concept Highlight Boxes: <div class="highlight-box dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200 p-5 rounded-2xl border my-6"><p><strong>💡 Key Concept:</strong> ...</p></div>
   - Visual Feature & Concept Grids: <div class="grid md:grid-cols-2 gap-4 my-6"><div class="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"><h4 class="font-bold text-gray-900 dark:text-white">...</h4><p class="text-sm text-gray-600 dark:text-gray-300 mt-2">...</p></div>...</div>
   - Real-world Impact & Use-cases list (Use clean flex rows, avoid narrow circular pills): <ul class="space-y-4 my-6 list-none pl-0"><li class="flex items-start gap-3"><span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg shrink-0">Category Badge</span><div><strong>Concept Name:</strong> In-depth explanation...</div></li></ul>
   - Inspiring Blockquotes: <blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-6 italic text-gray-700 dark:text-gray-300">...</blockquote>
5. Structure headings with descriptive emojis: <h2>, <h3>.

Return ONLY a valid JSON object matching this schema (ensure all strings are properly escaped on a single JSON line without raw unescaped newlines inside strings):
{
  "title": "Natural, Magnetic, and Eye-Catching Title",
  "slug": "url-friendly-slug-with-hyphens",
  "category": "${category || 'AI Automation'}",
  "excerpt": "A captivating 2-sentence hook (120-180 characters) summarizing the core value and intrigue.",
  "readTime": "8 min read",
  "tags": ["AI", "Technology", "Insights"],
  "content": "<div class=\\"blog-content dark:text-gray-100\\">...full 1500+ word HTML...</div>"
}`
                : `You are an elite Staff Software Engineer, tech lead, and architectural writer for Pubudu Tharanga's developer portfolio.
Write a world-class, deep, production-grade technical blog post with actionable architecture blueprints.

🎯 TITLE & HEADLINE RULES (MANDATORY):
- The title MUST be NATURAL, PUNCHY, and EYE-CATCHING.
- Avoid generic titles; make it sound like a senior engineer sharing hard-won production lessons (e.g. "Beyond the Hype: Building Resilient Microservices in 2026", "Why We Ditched [Tech] for [Tech]: Performance & Cost Analysis", "Architecting High-Scale APIs: Patterns, Benchmarks, and Tradeoffs").

Formatting Requirements:
- Write semantic HTML designed for Tailwind Typography.
- Include a compelling introductory paragraph with lead class: <p class="lead dark:text-gray-300">...
- Use <h2>, <h3> headings with appropriate tech emojis.
- Include structured UI callouts:
  * Highlight box: <div class="highlight-box dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200 p-5 rounded-2xl border my-6"><p><strong>Key Takeaway:</strong> ...</p></div>
  * Feature grids: <div class="grid md:grid-cols-2 gap-4 my-6"><div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"><h4>Feature</h4><p>...</p></div>...</div>
- Include syntax-highlighted code blocks with realistic code examples: <pre class="dark:bg-gray-800 dark:text-gray-200 p-4 rounded-xl overflow-x-auto"><code class="language-javascript">...</code></pre>
- Conclude with actionable architecture takeaways and benchmarks.

Return ONLY a valid JSON object matching this schema (ensure all strings are properly escaped on a single JSON line without raw unescaped newlines inside strings):
{
  "title": "Natural, High-Impact Technical Title",
  "slug": "url-friendly-slug-with-hyphens",
  "category": "${category || 'Web Development'}",
  "excerpt": "A concise 2-sentence hook (120-180 characters) summarizing the core value.",
  "readTime": "8 min read",
  "tags": ["React", "Next.js", "Architecture"],
  "content": "<div class=\\"blog-content dark:text-gray-100\\">...full HTML...</div>"
}`;

            const userPrompt = `Generate a blog post on the topic: "${topic.trim()}"
Category: ${category || 'AI Automation'}
Target Audience Level: ${audience || 'Beginner to Intermediate'}
${customNotes ? `Additional Notes / Specific Requirements: ${customNotes}` : ''}`;

            const blogSchema = {
                type: 'OBJECT',
                properties: {
                    title: { type: 'STRING' },
                    slug: { type: 'STRING' },
                    category: { type: 'STRING' },
                    excerpt: { type: 'STRING' },
                    readTime: { type: 'STRING' },
                    tags: { type: 'ARRAY', items: { type: 'STRING' } },
                    content: { type: 'STRING' }
                },
                required: ['title', 'slug', 'category', 'excerpt', 'readTime', 'tags', 'content']
            };

            const rawJson = await callGemini(apiKey, systemPrompt, userPrompt, blogSchema);
            const parsedData = robustJsonParse(rawJson);

            // Validate schema with Zod (Fixes H1)
            const validated = AiBlogResponseSchema.parse(parsedData);

            // Sanitize HTML on write/return (Fixes C3)
            validated.content = sanitizePostHtml(validated.content);

            return res.status(200).json({
                success: true,
                type: 'blog',
                data: validated
            });
        }

        // ----------------------------------------------------
        // TYPE: LINKEDIN GENERATION (Sinhala Post)
        // ----------------------------------------------------
        if (type === 'linkedin') {
            const blogTitle = postData?.title || topic || 'Modern Web Engineering';
            const blogExcerpt = postData?.excerpt || '';
            const blogSlug = postData?.slug || '';
            const blogUrl = `https://pubudu-tharanga.vercel.app/blog/${blogSlug}`;

            const systemPrompt = `You are a top-tier tech thought leader and viral content creator in Sri Lanka.
Translate and adapt the technical article into a natural, highly relatable, and scroll-stopping **Sinhala** (සිංහල) LinkedIn post for Sri Lankan software engineers, developers, students, and tech leaders.

🎯 SINHALA HOOK & TONE RULES:
- The opening hook MUST be natural, conversational, and instantly eye-catching in Sinhala (avoid stiff literal translations or textbook Sinhala).
- Write in smooth conversational Sinhala that modern software engineers use every day.
- Keep English technical terminology clean (e.g. Next.js, AI Automation, Cybersecurity, QA, API, Microservices, Cloud).

Structure of the Sinhala LinkedIn Post:
1. 🚀 Magnetic Hook: 1-2 lines in natural Sinhala with emojis that grab immediate attention on the feed.
2. 💡 The Core Problem/Opportunity: Why this matters in the real world right now.
3. 📌 3–4 Key Takeaways: Clear bullet points with practical insights.
4. 🔗 Call To Action: "සම්පූර්ණ Article එක මගේ Blog එකෙන් කියවන්න 👇" with link [BLOG_URL].
5. 🏷️ Hashtags: #PubuduTharanga #TechSriLanka #WebDev #SoftwareEngineering #SriLankaTech.

Return ONLY a valid JSON object matching this schema:
{
  "sinhalaPost": "Full formatted Sinhala post with line breaks and emojis",
  "hook": "Eye-catching natural Sinhala hook",
  "hashtags": ["#WebDev", "#TechSriLanka"]
}`;

            const userPrompt = `Title: ${blogTitle}
Excerpt: ${blogExcerpt}
Blog Link: ${blogUrl}
${customNotes ? `Extra Notes: ${customNotes}` : ''}`;

            const linkedinSchema = {
                type: 'OBJECT',
                properties: {
                    sinhalaPost: { type: 'STRING' },
                    hook: { type: 'STRING' },
                    hashtags: { type: 'ARRAY', items: { type: 'STRING' } }
                },
                required: ['sinhalaPost']
            };

            const rawJson = await callGemini(apiKey, systemPrompt, userPrompt, linkedinSchema);
            const parsedData = robustJsonParse(rawJson);

            // Validate with Zod
            const validated = AiLinkedInResponseSchema.parse(parsedData);

            // Ensure the real blog URL is placed in the post
            if (validated.sinhalaPost && blogSlug) {
                validated.sinhalaPost = validated.sinhalaPost.replace(/\[BLOG_URL\]/g, blogUrl);
            }

            return res.status(200).json({
                success: true,
                type: 'linkedin',
                data: validated
            });
        }

        return res.status(400).json({ success: false, error: 'Invalid generation type requested' });
    } catch (error) {
        console.error('API /api/admin/generate error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate content'
        });
    }
}
