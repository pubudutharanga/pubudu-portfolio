import { SITE, PROJECTS, BLOG_POSTS } from './src/data.js';

// Mock window for schema generation
const window = {
    location: {
        origin: 'https://pubudu-tharanga.vercel.app',
        href: 'https://pubudu-tharanga.vercel.app/blog'
    }
};

console.log("-----------------------------------------");
console.log("SEO SCHEMA VALIDATION TEST");
console.log("-----------------------------------------");

// 1. Person Schema (Base)
const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": SITE.name,
    "url": SITE.siteUrl,
    "sameAs": [SITE.linkedin, SITE.github, SITE.facebook]
};

// 2. Blog Collection Schema
const blogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Blog - Pubudu Tharanga",
    "url": window.location.href,
    "mainEntity": {
        "@type": "ItemList",
        "itemListElement": BLOG_POSTS.map((post, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${window.location.origin}/blog/${post.id}`,
            "name": post.title
        }))
    }
};

// 3. Portfolio ItemList Schema
const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": PROJECTS.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": project.live || project.github,
        "name": project.title,
        "description": project.description,
        "image": project.image.startsWith('http') ? project.image : `${window.location.origin}${project.image.replace(/^\./, '')}`
    }))
};

function validateJSON(label, data) {
    try {
        const json = JSON.stringify(data, null, 2);
        console.log(`✅ ${label} Valid JSON`);
        // Basic check for required fields
        if (!json.includes('@context') || !json.includes('@type')) {
            console.warn(`⚠️ ${label} missing @context or @type`);
        }
        return true;
    } catch (e) {
        console.error(`❌ ${label} Invalid JSON:`, e.message);
        return false;
    }
}

validateJSON("Person Schema", personSchema);
validateJSON("Blog Schema", blogSchema);
validateJSON("Projects Schema", projectsSchema);

console.log("\nSample Project Item:");
console.log(JSON.stringify(projectsSchema.itemListElement[0], null, 2));

console.log("\nSample Blog Item:");
console.log(JSON.stringify(blogSchema.mainEntity.itemListElement[0], null, 2));

