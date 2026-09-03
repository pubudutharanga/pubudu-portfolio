// App.jsx
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { SITE } from './data'
import { ClickSpark, Loader } from './components/reactbits'
import FallBeamBackground from './components/lightswind/fall-beam-background'
import { toggleThemeWithTransition, syncThemeToDOM } from './utils/themeTransition'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Blog = lazy(() => import('./pages/Blog'))
const PostPage = lazy(() => import('./pages/PostPage'))
const Admin = lazy(() => import('./pages/Admin'))

// Premium animated multi-step loading experience

const LoadingSpinner = () => <Loader fullScreen={true} />

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

    // Listen to OS system color scheme changes (when no explicit user override is stored)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e) => {
            const saved = localStorage.getItem('dark')
            if (saved === null) {
                setDark(e.matches)
            }
        }
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    // Register service worker after page load (deferred to avoid render-blocking)
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .catch(() => { /* SW registration failed silently */ })
            })
        }
    }, [])

    // Update document class, color-scheme, and meta tags when dark mode changes
    useEffect(() => {
        syncThemeToDOM(dark)
    }, [dark])

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [location.pathname])

    const handleToggleDark = (e) => {
        toggleThemeWithTransition(e, dark, setDark)
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 relative overflow-x-hidden">
            <FallBeamBackground 
                lineCount={30} 
                beamColorClass="blue-400" 
                className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" 
            />
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
            <Header site={SITE} dark={dark} setDark={setDark} toggleDark={handleToggleDark} />

            {/* Main Content */}
            <main id="main-content" className="pt-16 lg:pt-20 relative z-10" role="main">
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<Home site={SITE} dark={dark} />} />
                        <Route path="/blog" element={<Blog dark={dark} />} />
                        <Route path="/blog/:slug" element={<PostPage />} />
                        <Route path="/admin" element={<Admin />} />

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

            {/* Footer - Suppressed on admin studio routes for maximum workspace focus */}
            {!location.pathname.startsWith('/admin') && <Footer site={SITE} />}
        </div>
    )
}
