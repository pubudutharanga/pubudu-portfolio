import React from 'react'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Portfolio from '../sections/Portfolio'
import Services from '../sections/Services'
import Contact from '../sections/Contact'
import BlogPreview from '../sections/BlogPreview'
import SeoMeta from '../components/SeoMeta'

export default function Home({ site, dark }) {
  return (
    <div id="top">
      <SeoMeta
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${site.siteUrl}#website`,
            "name": site.name,
            "url": site.siteUrl,
            "description": "Full Stack Developer Portfolio - Building digital experiences with modern technologies",
            "inLanguage": "en-US",
            "publisher": {
              "@id": `${site.siteUrl}#person`
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${site.siteUrl}blog?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${site.siteUrl}#webpage`,
            "url": site.siteUrl,
            "name": `${site.name} - Full Stack Developer & Undergraduate | React & Node.js Specialist`,
            "description": "Building digital experiences with modern technologies | Full Stack Developer Sri Lanka",
            "inLanguage": "en-US",
            "isPartOf": {
              "@id": `${site.siteUrl}#website`
            },
            "about": {
              "@id": `${site.siteUrl}#person`
            },
            "datePublished": "2024-01-01",
            "dateModified": "2026-02-02"
          }
        ]}
      />
      <section id="home" className="min-h-[70vh]">
        <Hero site={site} dark={dark} />
      </section>
      <section id="about" className="max-w-6xl mx-auto py-16 px-4">
        <About dark={dark} />
      </section>
      <section id="portfolio" className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4"><Portfolio /></div>
      </section>
      <section id="services" className="max-w-6xl mx-auto py-16 px-4"><Services /></section>
      <section id="blog" className="max-w-6xl mx-auto py-16 px-4"><BlogPreview dark={dark} /></section>
      <section id="contact" className="max-w-6xl mx-auto py-16 px-4"><Contact /></section>
    </div>
  )
}
