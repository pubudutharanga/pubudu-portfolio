import React, { lazy, Suspense } from 'react'
import Hero from '../sections/Hero'
import SeoMeta from '../components/SeoMeta'

// Lazy load below-the-fold sections to reduce initial JS execution
const About = lazy(() => import('../sections/About'))
const Portfolio = lazy(() => import('../sections/Portfolio'))
const Services = lazy(() => import('../sections/Services'))
const Contact = lazy(() => import('../sections/Contact'))
const BlogPreview = lazy(() => import('../sections/BlogPreview'))

export default function Home({ site, dark }) {
  return (
    <div id="top">
      <SeoMeta
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "@id": `${site.siteUrl.replace(/\/$/, '')}/#profilepage`,
            "mainEntity": {
              "@type": "Person",
              "@id": `${site.siteUrl.replace(/\/$/, '')}/#person`,
              "name": site.name,
              "alternateName": ["Pubudu", "Pubudu Tharanga Matara"],
              "url": site.siteUrl,
              "image": `${site.siteUrl.replace(/\/$/, '')}/PTb.png`,
              "description": site.tagline,
              "sameAs": [
                site.linkedin,
                site.github,
                site.facebook
              ]
            },
            "dateCreated": "2024-01-01T00:00:00+05:30",
            "dateModified": "2026-04-28T00:00:00+05:30"
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${site.siteUrl.replace(/\/$/, '')}/#webpage`,
            "url": site.siteUrl,
            "name": `${site.name} - Full Stack Developer & Undergraduate | React & Node.js Specialist`,
            "description": "Building digital experiences with modern technologies | Full Stack Developer Sri Lanka",
            "inLanguage": "en-US",
            "isPartOf": {
              "@id": `${site.siteUrl.replace(/\/$/, '')}/#website`
            },
            "about": {
              "@id": `${site.siteUrl.replace(/\/$/, '')}/#person`
            },
            "datePublished": "2024-01-01T00:00:00+05:30",
            "dateModified": "2026-04-28T00:00:00+05:30"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": site.siteUrl
            }]
          }
        ]}
      />
      <section id="home" className="min-h-[70vh]">
        <Hero site={site} dark={dark} />
      </section>
      <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading section...</div>}>
        <section id="about" className="max-w-6xl mx-auto py-16 px-4">
          <About dark={dark} />
        </section>
        <section id="portfolio" className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="max-w-6xl mx-auto px-4"><Portfolio /></div>
        </section>
        <section id="services" className="max-w-6xl mx-auto py-16 px-4"><Services /></section>
        <section id="blog" className="max-w-6xl mx-auto py-16 px-4"><BlogPreview dark={dark} /></section>
        <section id="contact" className="max-w-6xl mx-auto py-16 px-4"><Contact /></section>
      </Suspense>
    </div>
  )
}
