import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoMeta = ({
    title,
    description,
    keywords,
    canonical,
    openGraph,
    twitter,
    type = 'website'
}) => {
    // Default site metadata
    const siteTitle = 'Pubudu Tharanga - AI Engineer & Full Stack Developer';
    const siteUrl = window.location.origin;
    const defaultKeywords = "Pubudu Tharanga, AI Engineer, Artificial Intelligence, Machine Learning, Full Stack Developer, React, Node.js, Sri Lanka";

    // Construct full title
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    // Construct absolute image URL for OG
    const ogImage = openGraph?.image ?
        (openGraph.image.startsWith('http') ? openGraph.image : `${siteUrl}${openGraph.image}`) :
        `${siteUrl}/og-image-2025.jpg`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || "Personal portfolio of Pubudu Tharanga, an AI Engineer and Full Stack Developer specializing in Artificial Intelligence and modern web tech."} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <link rel="canonical" href={canonical || window.location.href} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonical || window.location.href} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || "AI Engineer & Full Stack Developer portfolio."} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonical || window.location.href} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || "AI Engineer & Full Stack Developer portfolio."} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": type === 'article' ? 'Article' : 'WebSite',
                    "headline": fullTitle,
                    "image": [ogImage],
                    "author": {
                        "@type": "Person",
                        "name": "Pubudu Tharanga",
                        "jobTitle": "AI Engineer & Full Stack Developer",
                        "url": siteUrl,
                        "knowsAbout": ["Artificial Intelligence", "Machine Learning", "React", "Node.js"]
                    },
                    "description": description || "AI Engineer & Full Stack Developer portfolio showcasing projects and skills."
                })}
            </script>
        </Helmet>
    );
};

export default SeoMeta;
