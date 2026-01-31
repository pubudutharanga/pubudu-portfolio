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
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": site.name,
          "url": site.siteUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${site.siteUrl}blog?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }}
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
