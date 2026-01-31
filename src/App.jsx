// App.jsx
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { SITE } from './data'
import { ClickSpark } from './components/reactbits'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Blog = lazy(() => import('./pages/Blog'))
const PostPage = lazy(() => import('./pages/PostPage'))

// Loading component
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
    </div>
)

export default function App() {
    const location = useLocation()
    // Initialize dark mode from system preference or localStorage
    const [dark, setDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dark')
            if (saved !== null) {
                return saved === 'true'
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return false
    })

    // Remove the redundant initial useEffect that was causing the overwrite logic


    // Update document class when dark mode changes
    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark)
        localStorage.setItem('dark', dark.toString())
    }, [dark])

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [location.pathname])

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
            <SpeedInsights />
            <Analytics />

            {/* Click Spark - Only in light mode */}
            {!dark && (
                <ClickSpark
                    sparkColor="#0ea5e9"
                    sparkSize={12}
                    sparkRadius={20}
                    sparkCount={8}
                    duration={400}
                />
            )}

            {/* Header */}
            <Header site={SITE} dark={dark} setDark={setDark} />

            {/* Main Content */}
            <main id="main-content" className="pt-16 lg:pt-20" role="main">
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<Home site={SITE} dark={dark} />} />
                        <Route path="/blog" element={<Blog dark={dark} />} />
                        <Route path="/blog/:id" element={<PostPage />} />

                        {/* 404 Fallback */}
                        <Route path="*" element={
                            <div className="min-h-screen flex items-center justify-center">
                                <div className="text-center">
                                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
                                    <a
                                        href="/"
                                        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        Return Home
                                    </a>
                                </div>
                            </div>
                        } />
                    </Routes>
                </Suspense>
            </main>

            {/* Footer */}
            <Footer site={SITE} />
        </div>
    )
}
