import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiSun, FiMoon, FiCode } from 'react-icons/fi'

export default function EnhancedNav({ site, dark, setDark }) {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollTo = (id) => {
        setOpen(false)
        if (location.pathname !== '/') {
            navigate('/')
            setTimeout(() => {
                const el = document.getElementById(id)
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        } else {
            const el = document.getElementById(id)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const navItems = [
        { label: 'Home', action: () => scrollTo('home') },
        { label: 'About', action: () => scrollTo('about') },
        { label: 'Portfolio', action: () => scrollTo('portfolio') },
        { label: 'Blog', action: () => navigate('/blog') },
        { label: 'Services', action: () => scrollTo('services') },
        { label: 'Contact', action: () => scrollTo('contact') },
    ]

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled
                ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50'
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:p-6">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="p-2 bg-primary-500 rounded-lg group-hover:scale-110 transition-transform">
                        <FiCode className="text-white text-lg" />
                    </div>
                    <div>
                        <div className="text-xl font-bold gradient-text">{site.name}</div>
                        <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                            {site.title}
                        </div>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className="nav-link relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                        </button>
                    ))}

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setDark(!dark)}
                        aria-label="toggle theme"
                        className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        {dark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
                    </button>
                </nav>

                {/* Mobile Navigation Toggle */}
                <div className="md:hidden flex items-center gap-3">
                    <button
                        onClick={() => setDark(!dark)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                    >
                        {dark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
                    </button>
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label="menu"
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                    >
                        {open ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ${
                open
                    ? 'max-h-96 opacity-100 border-t border-gray-200 dark:border-gray-700'
                    : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                    <div className="flex flex-col p-4 gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    )
}