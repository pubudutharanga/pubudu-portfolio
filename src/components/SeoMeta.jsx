import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE } from '../data';

const SeoMeta = ({
    title,
    description,
    keywords,
    canonical,
    image,
    type = 'website'
}) => {
    // Single Source of Truth for Domain
    const siteUrl = SITE.siteUrl.replace(/\/$/, ''); // Remove trailing slash for consistency

    // Construct full title
    const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} - ${SITE.title}`;

    // Construct absolute URLs
    const canonicalUrl = canonical || window.location.href;
    const ogImage = image
        ? (image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`)
        : `${siteUrl}/og-image-2026.jpg`;

    // Person Schema (The "Knowledge Graph" Power)
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": SITE.name,
        "jobTitle": "AI Engineer & Full Stack Developer",
        "url": siteUrl,
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
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Sri Lanka"
        }
    };

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || SITE.tagline} />
            <meta name="keywords" content={keywords || SITE.keywords} />
            <meta name="author" content={SITE.name} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || SITE.tagline} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={SITE.name} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || SITE.tagline} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(personSchema)}
            </script>
        </Helmet>
    );
};

export default SeoMeta;
