import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE } from '../data';

const SeoMeta = ({
    title,
    description,
    keywords,
    canonical,
    image,
    type = 'website',
    schema = null // Allow passing custom schema or specific schema type data
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

    // Base Person Schema (Identity) - valid for all pages as the "Author/Owner"
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": SITE.name,
        "alternateName": ["Pubudu Tharanga Matara", "Pubudu"],
        "jobTitle": "Full Stack Developer",
        "url": siteUrl,
        "image": `${siteUrl}/PTb.png`, // Using the background-removed profile image for cleaner look
        "gender": "Male",
        "nationality": "Sri Lankan",
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "Sabaragamuwa University of Sri Lanka"
        },
        "sameAs": [
            SITE.linkedin,
            SITE.github,
            SITE.facebook,
            "https://x.com/PAbewarna29795", // Assuming twitter handle based on meta tags
        ],
        "knowsAbout": [
            "React", "Node.js", "Python", "JavaScript", "Full Stack Development",
            "Frontend Development", "Backend Development", "MERN Stack",
            "MongoDB", "Express.js", "Tailwind CSS", "API Development",
            "Database Design", "Responsive Web Design", "Git"
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
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || SITE.tagline} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:creator" content="@PAbewarna29795" />

            {/* Structured Data (JSON-LD) - Person */}
            <script type="application/ld+json">
                {JSON.stringify(personSchema)}
            </script>

            {/* Dynamic Schema (e.g. WebSite, Article) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SeoMeta;
