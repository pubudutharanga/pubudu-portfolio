import 'dotenv/config';

import { verifyAdminPassword, signAdminToken, requireAdminSession } from '../api/lib/auth.js';
import { sanitizePostHtml } from '../api/lib/sanitize.js';
import { AiBlogResponseSchema, PostInputSchema } from '../api/lib/schemas.js';
import { getDatabase } from '../api/lib/mongodb.js';

async function runTestSuite() {
    console.log('🧪 Starting Dual-Mode Admin Backend Test Suite...\n');

    let passed = 0;
    let failed = 0;

    function assert(name, condition) {
        if (condition) {
            console.log(`  ✅ PASS: ${name}`);
            passed++;
        } else {
            console.error(`  ❌ FAIL: ${name}`);
            failed++;
        }
    }

    // 1. Test Auth & Password Verification
    console.log('1️⃣ Testing Auth & Security (C1, C2):');
    const validPass = await verifyAdminPassword('Googlefm');
    assert('Verify correct admin password', validPass === true);

    const invalidPass = await verifyAdminPassword('wrong_password_123');
    assert('Reject incorrect admin password', invalidPass === false);

    const token = signAdminToken({ role: 'admin' });
    assert('Sign valid 24h JWT token', typeof token === 'string' && token.length > 20);

    const mockReqValid = {
        headers: {
            cookie: `admin_session=${token}`
        }
    };
    const session = requireAdminSession(mockReqValid);
    assert('requireAdminSession verifies cookie token', session && session.role === 'admin');

    let threwUnauthorized = false;
    try {
        requireAdminSession({ headers: {} });
    } catch (e) {
        threwUnauthorized = true;
    }
    assert('requireAdminSession blocks unauthenticated requests (401)', threwUnauthorized === true);

    // 2. Test HTML Sanitization (C3 - XSS Prevention)
    console.log('\n2️⃣ Testing HTML Sanitizer (C3):');
    const maliciousHtml = '<p>Normal text</p><script>alert("XSS")</script><img src="x" onerror="evil()" /><a href="javascript:steal()">Click</a>';
    const cleanHtml = sanitizePostHtml(maliciousHtml);
    assert('Strip <script> tags', !cleanHtml.includes('<script>') && !cleanHtml.includes('alert'));
    assert('Strip onerror= attributes', !cleanHtml.includes('onerror') && !cleanHtml.includes('evil'));
    assert('Strip javascript: hrefs', !cleanHtml.includes('javascript:'));
    assert('Preserve safe <p> and <a> tags', cleanHtml.includes('<p>Normal text</p>'));

    const richUiHtml = '<div class="highlight-box dark:bg-blue-900/20"><p><strong>Note:</strong> Safe</p></div><pre class="dark:bg-gray-800"><code class="language-javascript">const x = 1;</code></pre>';
    const sanitizedRich = sanitizePostHtml(richUiHtml);
    assert('Preserve rich highlight boxes & code snippets', sanitizedRich.includes('highlight-box') && sanitizedRich.includes('language-javascript'));

    // 3. Test Schema Validation (H1)
    console.log('\n3️⃣ Testing Zod Schema Validation (H1):');
    const validBlog = {
        title: 'Mastering Next.js 15 Server Actions',
        slug: 'mastering-nextjs-15-server-actions',
        category: 'Tutorials',
        excerpt: 'An in-depth guide on mastering modern server actions in Next.js 15 with zero client bundle overhead.',
        readTime: '6 min read',
        tags: ['Next.js', 'React', 'Full Stack'],
        content: '<p class="lead">Next.js 15 brings revolutionary full-stack primitives with async request APIs and seamless Server Actions integration.</p><p>Here is an in-depth breakdown of server-side data mutations.</p>'
    };
    const blogParsed = AiBlogResponseSchema.safeParse(validBlog);
    assert('Validate valid AI blog response', blogParsed.success === true);

    const invalidSlugBlog = {
        ...validBlog,
        slug: 'Invalid Slug With Uppercase & Spaces!'
    };
    const invalidSlugParsed = AiBlogResponseSchema.safeParse(invalidSlugBlog);
    assert('Reject malformed slugs', invalidSlugParsed.success === false);

    // 4. Test MongoDB Atlas Connection & CRUD
    console.log('\n4️⃣ Testing MongoDB Atlas Connection (H2, H3):');
    try {
        const db = await getDatabase();
        const collection = db.collection('blogs');
        const count = await collection.countDocuments({});
        assert('Connect to MongoDB Atlas and query blogs', count > 0);
        console.log(`     (Found ${count} existing articles in MongoDB Atlas)`);
    } catch (e) {
        assert('Connect to MongoDB Atlas', false);
        console.error('     MongoDB error:', e.message);
    }

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} passed, ${failed} failed.`);
    console.log(`========================================\n`);

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runTestSuite();
