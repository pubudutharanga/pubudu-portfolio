import React, { lazy, Suspense } from 'react'
import Hero from '../sections/Hero'
import SeoMeta from '../components/SeoMeta'

// Lazy load below-the-fold sections to reduce initial JS execution
const About = lazy(() => import('../sections/About'))
const Portfolio = lazy(() => import('../sections/Portfolio'))
const Services = lazy(() => import('../sections/Services'))
const Contact = lazy(() => import('../sections/Contact'))
const BlogPreview = lazy(() => import('../sections/BlogPreview'))
const GlobalProjects = lazy(() => import('../sections/GlobalProjects'))

// content-visibility: auto — browser skips rendering work for off-screen sections
const cvAutoStyle = { contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }

// Lightweight skeleton fallback (avoids importing heavy Loader for each section)
const SectionSkeleton = () => (
  <div className="max-w-6xl mx-auto py-16 px-4">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 max-w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />)}
      </div>
    </div>
  </div>
)

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
            "dateModified": "2026-07-21T00:00:00+05:30"
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${site.siteUrl.replace(/\/$/, '')}/#webpage`,
            "url": site.siteUrl,
            "name": `${site.name} - ${site.title}`,
            "description": "Professional web development services for startups & businesses — Next.js, React, Node.js, MERN Stack | Available for remote projects worldwide",
            "inLanguage": "en-US",
            "isPartOf": {
              "@id": `${site.siteUrl.replace(/\/$/, '')}/#website`
            },
            "about": {
              "@id": `${site.siteUrl.replace(/\/$/, '')}/#person`
            },
            "datePublished": "2024-01-01T00:00:00+05:30",
            "dateModified": "2026-07-21T00:00:00+05:30"
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
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I hire Pubudu Tharanga for a web development project?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can hire me by visiting the Contact section on my portfolio or emailing pubudutharange@gmail.com. I offer free initial consultations to discuss your project requirements, timeline, and budget. I work with clients across the US, UK, Europe, and worldwide."
                }
              },
              {
                "@type": "Question",
                "name": "What technologies does Pubudu Tharanga specialize in?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "I specialize in Next.js Server-Side Rendering (SSR), React, and the MERN stack (MongoDB, Express.js, React, Node.js), along with TypeScript, PostgreSQL, Tailwind CSS, and Python. I build highly responsive, SEO-optimized web applications with modern frameworks."
                }
              },
              {
                "@type": "Question",
                "name": "Do you work with clients in the US, UK, and Europe?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! I work remotely with clients worldwide, with a focus on the US, UK, and European markets. I'm flexible with timezones and maintain clear communication through tools like Slack, Zoom, and project management platforms."
                }
              },
              {
                "@type": "Question",
                "name": "How does the remote collaboration process work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "I follow a milestone-based approach: 1) Free consultation to understand your needs, 2) Project proposal with timeline and deliverables, 3) Iterative development with regular updates and demos, 4) Testing and deployment, 5) Post-launch support. I use Git, CI/CD, and agile methodologies."
                }
              },
              {
                "@type": "Question",
                "name": "What is the typical timeline and cost for a web development project?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Project timelines vary based on complexity: simple websites take 2-4 weeks, web applications 4-8 weeks, and complex platforms 8-16 weeks. I offer competitive rates with flexible pricing models including fixed-price, hourly, and milestone-based payments. Contact me for a free quote."
                }
              }
            ]
          }
        ]}
      />
      <section id="home" className="min-h-[70vh]">
        <Hero site={site} dark={dark} />
      </section>

      {/* Per-section Suspense boundaries enable parallel loading — one slow section doesn't block others */}
      {/* content-visibility: auto skips rendering work for off-screen sections */}
      <Suspense fallback={<SectionSkeleton />}>
        <section id="about" className="max-w-6xl mx-auto py-16 px-4" style={cvAutoStyle}>
          <About dark={dark} />
        </section>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <section id="portfolio" className="bg-gray-50/75 dark:bg-gray-800/50 py-16" style={cvAutoStyle}>
          <div className="max-w-6xl mx-auto px-4"><Portfolio /></div>
        </section>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <section id="services" className="max-w-6xl mx-auto py-16 px-4" style={cvAutoStyle}>
          <Services />
        </section>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <section id="blog" className="max-w-6xl mx-auto py-16 px-4" style={cvAutoStyle}>
          <BlogPreview dark={dark} />
        </section>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <section id="global" style={cvAutoStyle}>
          <GlobalProjects dark={dark} />
        </section>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <section id="contact" className="max-w-6xl mx-auto py-16 px-4" style={cvAutoStyle}>
          <Contact />
        </section>
      </Suspense>
    </div>
  )
}
