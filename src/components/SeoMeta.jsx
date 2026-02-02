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
    // Enhanced with ImageObject for better rich results (2025/2026 best practice)
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        "name": SITE.name,
        "alternateName": ["Pubudu Tharanga Matara", "Pubudu"],
        "jobTitle": "Full Stack Developer",
        "url": siteUrl,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${siteUrl}/#webpage`
        },
        "image": {
            "@type": "ImageObject",
            "url": `${siteUrl}/PTb.png`,
            "width": 400,
            "height": 400,
            "caption": "Pubudu Tharanga - Full Stack Developer"
        },
        "gender": "Male",
        "nationality": "Sri Lankan",
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "Sabaragamuwa University of Sri Lanka",
            "url": "https://www.sab.ac.lk/"
        },
        "worksFor": {
            "@type": "Organization",
            "name": "Freelance"
        },
        "sameAs": [
            SITE.linkedin,
            SITE.github,
            SITE.facebook,
            "https://x.com/PAbewarna29795"
        ],
        "knowsAbout": [
            "React", "Node.js", "Python", "JavaScript", "Full Stack Development",
            "Frontend Development", "Backend Development", "MERN Stack",
            "MongoDB", "Express.js", "Tailwind CSS", "API Development",
            "Database Design", "Responsive Web Design", "Git", "TypeScript",
            "Next.js", "PostgreSQL", "Web Performance Optimization"
        ],
        "description": SITE.tagline,
        "email": `mailto:${SITE.email}`,
        "telephone": SITE.phone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": SITE.address,
            "addressLocality": SITE.city,
            "postalCode": SITE.postalCode,
            "addressCountry": "LK"
        }
    };

    // ProfessionalService Schema for local SEO
    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#business`,
        "name": "Pubudu Tharanga - Full Stack Development Services",
        "image": `${siteUrl}/og-image-2026.jpg`,
        "url": siteUrl,
        "telephone": SITE.phone,
        "email": SITE.email,
        "description": "Professional Full Stack Development services specializing in React, Node.js, and modern web technologies. Available for remote work worldwide.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": SITE.address,
            "addressLocality": SITE.city,
            "postalCode": SITE.postalCode,
            "addressCountry": "LK"
        },
        "priceRange": "$$",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Development Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Web Development"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Full Stack Development"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "UI/UX Design"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Technical Consulting"
                    }
                }
            ]
        },
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 5.9549,
                "longitude": 80.5550
            },
            "geoRadius": "50000"
        },
        "founder": {
            "@id": `${siteUrl}/#person`
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

            {/* Structured Data (JSON-LD) - Professional Service for Local SEO */}
            <script type="application/ld+json">
                {JSON.stringify(professionalServiceSchema)}
            </script>

            {/* Dynamic Schema (e.g. WebSite, Article, or array of schemas) */}
            {schema && (
                Array.isArray(schema) ? (
                    schema.map((schemaItem, index) => (
                        <script key={`schema-${index}`} type="application/ld+json">
                            {JSON.stringify(schemaItem)}
                        </script>
                    ))
                ) : (
                    <script type="application/ld+json">
                        {JSON.stringify(schema)}
                    </script>
                )
            )}
        </Helmet>
    );
};

export default SeoMeta;
