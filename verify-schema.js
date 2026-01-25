import { SITE } from './src/data.js';

const siteUrl = SITE.siteUrl.replace(/\/$/, '');

const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": SITE.name,
    "jobTitle": "Full Stack Developer",
    "url": siteUrl,
    "image": `${siteUrl}/PT.png`,
    "gender": "Male",
    "sameAs": [
        SITE.linkedin,
        SITE.github,
        SITE.facebook
    ],
    "knowsAbout": [
        "Artificial Intelligence", "Machine Learning", "Deep Learning",
        "Generative AI", "LLMs", "TensorFlow", "PyTorch", "OpenAI API",
        "React", "Node.js", "Python", "JavaScript", "Full Stack Development"
    ],
    "description": SITE.tagline,
    "email": `mailto:${SITE.email}`,
    "telephone": SITE.phone,
    "address": {
        "@type": "PostalAddress",
        "streetAddress": SITE.address,
        "addressLocality": SITE.city,
        "postalCode": SITE.postalCode,
        "addressCountry": SITE.country
    }
};

let jsonLd = [personSchema];

console.log("-----------------------------------------");
console.log("JSON-LD VALIDATION TEST");
console.log("-----------------------------------------");

try {
    const jsonString = JSON.stringify(jsonLd, null, 2);
    console.log("✅ JSON.stringify success:");
    console.log(jsonString);
} catch (error) {
    console.error("❌ JSON.stringify FAILED:", error);
}
