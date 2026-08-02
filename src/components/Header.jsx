// Header.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiSun, FiMoon, FiCode } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggeredMenu } from './reactbits'

export default function Header({ site, dark, setDark, toggleDark }) {
    const handleThemeToggle = (e) => {
        if (toggleDark) {
            toggleDark(e)
        } else {
            setDark(!dark)
        }
    }
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        let ticking = false
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 60)
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id) => {
        setIsOpen(false)
        if (location.pathname !== '/') {
            navigate('/')
            setTimeout(() => {
                const element = document.getElementById(id)
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        } else {
            const element = document.getElementById(id)
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const navItems = [
        { label: 'Home', action: () => scrollToSection('home') },
        { label: 'About', action: () => scrollToSection('about') },
        { label: 'Portfolio', action: () => scrollToSection('portfolio') },
        { label: 'Services', action: () => scrollToSection('services') },
        { label: 'Blog', action: () => navigate('/blog') },
        { label: 'Contact', action: () => scrollToSection('contact') },
    ]

    // StaggeredMenu items for mobile
    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home section', link: '#home' },
        { label: 'About', ariaLabel: 'Learn about me', link: '#about' },
        { label: 'Portfolio', ariaLabel: 'View my projects', link: '#portfolio' },
        { label: 'Services', ariaLabel: 'View my services', link: '#services' },
        { label: 'Blog', ariaLabel: 'Read my blog', link: '/blog' },
        { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
    ]

    const socialItems = [
        { label: 'LinkedIn', link: site.linkedin },
        { label: 'GitHub', link: site.github },
        { label: 'Facebook', link: site.facebook }
    ]

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    }

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    }

    const mobileItemVariants = {
        closed: { opacity: 0, x: -20 },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    }

    return (
        <>
            <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
                <motion.header
                    className={`pointer-events-auto w-full overflow-hidden transition-[width,max-width,margin,border-radius,background-color,border-color,box-shadow,height,padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled || isOpen
                        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-xl shadow-black/5 border-b border-gray-200/60 dark:border-gray-800/60 md:w-[92%] lg:w-[86%] md:max-w-5xl md:mt-3 lg:mt-4 md:rounded-full md:border md:border-gray-200/80 md:dark:border-gray-700/80 md:shadow-2xl md:shadow-black/10'
                        : 'bg-white dark:bg-gray-900 w-full max-w-full mt-0 rounded-none border-b border-gray-100 dark:border-gray-800/60 shadow-none'
                        }`}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
                        <div className={`flex items-center justify-between transition-[height,padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
                        }`}>
                            {/* Logo */}
                            <motion.div
                                className="flex items-center gap-3 cursor-pointer group select-none"
                                onClick={() => navigate('/')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div
                                    className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-md group-hover:rotate-6"
                                    whileHover={{ rotate: 5 }}
                                >
                                    <FiCode className="text-white text-xl" />
                                </motion.div>
                                <motion.div
                                    className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight"
                                    whileHover={{ scale: 1.04 }}
                                >
                                    {site.name}
                                </motion.div>
                            </motion.div>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" role="navigation" aria-label="Main navigation">
                                <motion.div
                                    className="flex items-center gap-1 xl:gap-1.5"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {navItems.map((item, index) => (
                                        <motion.button
                                            key={item.label}
                                            onClick={item.action}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/70 transition-all duration-300 cursor-pointer select-none"
                                            variants={itemVariants}
                                            whileHover={{ y: -1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {item.label}
                                        </motion.button>
                                    ))}
                                </motion.div>

                                {/* Theme Toggle */}
                                <motion.button
                                    onClick={handleThemeToggle}
                                    aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                                    aria-pressed={dark}
                                    type="button"
                                    className="ml-2 p-2.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200/80 dark:border-gray-700/80 shadow-sm cursor-pointer flex items-center justify-center"
                                    whileHover={{ scale: 1.08, rotate: 15 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {dark ? (
                                        <FiSun className="text-amber-400 text-lg" />
                                    ) : (
                                        <FiMoon className="text-slate-700 dark:text-slate-200 text-lg" />
                                    )}
                                </motion.button>
                            </nav>
                        </div>
                    </div>
                </motion.header>
            </div>

            {/* Mobile StaggeredMenu - Fixed overlay */}
            <div className="lg:hidden fixed inset-0 pointer-events-none z-[60]">
                <StaggeredMenu
                    position="right"
                    items={menuItems}
                    socialItems={socialItems}
                    displaySocials={true}
                    displayItemNumbering={true}
                    menuButtonColor={dark ? '#ffffff' : '#374151'}
                    openMenuButtonColor={dark ? '#ffffff' : '#111'}
                    changeMenuColorOnOpen={true}
                    colors={['#3b82f6', '#8b5cf6']}
                    accentColor="#3b82f6"
                    closeOnClickAway={true}
                    siteName={site.name}
                    siteTitle={site.title}
                    dark={dark}
                    onToggleDark={handleThemeToggle}
                    navigate={navigate}
                />
            </div>
        </>
    )
}
