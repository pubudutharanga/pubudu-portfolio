// Header.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiSun, FiMoon, FiCode } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggeredMenu } from './reactbits'

export default function Header({ site, dark, setDark }) {
    const [isOpen, setIsOpen] = useState(false)
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
            <motion.header
                className={`fixed w-full z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ${scrolled || isOpen
                    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg shadow-black/5 border-b border-gray-200/50 dark:border-gray-700/50'
                    : 'bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <motion.div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => navigate('/')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-lg"
                                whileHover={{ rotate: 5 }}
                            >
                                <FiCode className="text-white text-xl" />
                            </motion.div>
                            <div>
                                <motion.div
                                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {site.name}
                                </motion.div>
                                <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {site.title}
                                </div>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Main navigation">
                            <motion.div
                                className="flex items-center gap-8"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                role="menu"
                            >
                                {navItems.map((item, index) => (
                                    <motion.button
                                        key={item.label}
                                        onClick={item.action}
                                        className="relative text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 py-2"
                                        variants={itemVariants}
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.label}
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                            whileHover={{ width: "100%" }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>
                                ))}
                            </motion.div>

                            {/* Theme Toggle */}
                            <motion.button
                                onClick={() => setDark(!dark)}
                                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                                aria-pressed={dark}
                                type="button"
                                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 border border-gray-200 dark:border-gray-700"
                                whileHover={{ scale: 1.05, rotate: 15 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {dark ? (
                                    <FiSun className="text-yellow-400 text-lg" />
                                ) : (
                                    <FiMoon className="text-gray-600 text-lg" />
                                )}
                            </motion.button>

                            {/* CTA Button */}
                            <motion.button
                                onClick={() => scrollToSection('contact')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get In Touch
                            </motion.button>
                        </nav>
                    </div>


                </div>

                {/* Progress Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: scrolled ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.header>

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
                    onToggleDark={() => setDark(!dark)}
                    navigate={navigate}
                />
            </div>
        </>
    )
}
