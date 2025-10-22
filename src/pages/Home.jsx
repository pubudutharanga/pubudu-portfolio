import React from 'react'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Portfolio from '../sections/Portfolio'
import Services from '../sections/Services'
import Contact from '../sections/Contact'
import BlogPreview from '../sections/BlogPreview'

export default function Home({site}){
  return (
    <div id="top">
      <section id="home" className="min-h-[70vh]">
        <Hero site={site}/>
      </section>
      <section id="about" className="max-w-6xl mx-auto py-16 px-4">
        <About/>
      </section>
      <section id="portfolio" className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4"><Portfolio/></div>
      </section>
      <section id="services" className="max-w-6xl mx-auto py-16 px-4"><Services/></section>
      <section id="blog" className="max-w-6xl mx-auto py-16 px-4"><BlogPreview/></section>
      <section id="contact" className="max-w-6xl mx-auto py-16 px-4"><Contact/></section>
    </div>
  )
}
