// Footer.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaLinkedin, FaGithub, FaFacebook, FaArrowUp, FaEnvelope, FaMapMarkerAlt, FaPhone, FaCode, FaHeart, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

export default function Footer({ site }) {
    const navigate = useNavigate()
    const [subscribeEmail, setSubscribeEmail] = useState('')
    const [subscribeStatus, setSubscribeStatus] = useState(null)
    const [isSubscribing, setIsSubscribing] = useState(false)

    // EmailJS Configuration for Subscriptions
    const EMAILJS_CONFIG = {
        SERVICE_ID: 'service_w531vvm', // Same as contact form
        SUBSCRIPTION_TEMPLATE_ID: 'template_u27dhh6', // New template ID for subscriptions
        PUBLIC_KEY: 'jv9WZymPcXR2GtfFA' // Same as contact form
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const scrollToSection = (id) => {
        if (window.location.pathname !== '/') {
            navigate('/')
            setTimeout(() => {
                const element = document.getElementById(id)
                if (element) element.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        } else {
            const element = document.getElementById(id)
            if (element) element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const handleSubscription = async (e) => {
        e.preventDefault()
        setIsSubscribing(true)

        // Validation
        if (!subscribeEmail) {
            setSubscribeStatus({ type: 'error', msg: 'Please enter your email address.' })
            setIsSubscribing(false)
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(subscribeEmail)) {
            setSubscribeStatus({ type: 'error', msg: 'Please enter a valid email address.' })
            setIsSubscribing(false)
            return
        }

        try {
            // Prepare template parameters
            const templateParams = {
                email: subscribeEmail,
                date: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                subscriber_number: Math.floor(Math.random() * 1000) + 1, // Simulated subscriber count
                to_name: site.name
            }

            // Send subscription email
            const result = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.SUBSCRIPTION_TEMPLATE_ID,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            )

            if (result.status === 200) {
                setSubscribeStatus({
                    type: 'success',
                    msg: '🎉 Thank you for subscribing! You\'ll be the first to know about my latest projects and blog posts.'
                })
                setSubscribeEmail('') // Clear the input
            }
        } catch (error) {
            console.error('Subscription error:', error)
            setSubscribeStatus({
                type: 'error',
                msg: 'Sorry, there was an error processing your subscription. Please try again later.'
            })
        } finally {
            setIsSubscribing(false)
        }
    }

    const quickLinks = [
        { label: 'Home', action: () => scrollToSection('home') },
        { label: 'About', action: () => scrollToSection('about') },
        { label: 'Portfolio', action: () => scrollToSection('portfolio') },
        { label: 'Services', action: () => scrollToSection('services') },
        { label: 'Blog', action: () => navigate('/blog') },
        { label: 'Contact', action: () => scrollToSection('contact') },
    ]

    const socialLinks = [
        {
            icon: FaLinkedin,
            href: site.linkedin,
            label: 'LinkedIn',
            color: 'hover:text-blue-600 dark:hover:text-blue-400',
            bgColor: 'hover:bg-blue-500/10 dark:hover:bg-blue-500/10'
        },
        {
            icon: FaGithub,
            href: site.github,
            label: 'GitHub',
            color: 'hover:text-gray-900 dark:hover:text-gray-300',
            bgColor: 'hover:bg-gray-500/10 dark:hover:bg-gray-500/10'
        },
        {
            icon: FaFacebook,
            href: site.facebook,
            label: 'Facebook',
            color: 'hover:text-blue-600 dark:hover:text-blue-400',
            bgColor: 'hover:bg-blue-500/10 dark:hover:bg-blue-500/10'
        },
    ]

    const contactInfo = [
        { icon: FaEnvelope, value: site.email, href: `mailto:${site.email}` },
        { icon: FaPhone, value: site.phone, href: `tel:${site.phone}` },
        { icon: FaMapMarkerAlt, value: site.location },
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    return (
        <footer className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-white overflow-hidden border-t border-gray-200 dark:border-gray-800">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>

            {/* Main Footer Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-16">
                <motion.div
                    className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Brand Column */}
                    <motion.div
                        className="lg:col-span-1"
                        variants={itemVariants}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <FaCode className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    {site.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{site.title}</p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            Full-stack developer crafting exceptional digital experiences with modern technologies
                            and innovative solutions.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map(({ icon: Icon, href, label, color, bgColor }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 bg-gray-100 dark:bg-gray-800 rounded-xl transition-all duration-300 ${bgColor} ${color} border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600`}
                                    aria-label={label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon size={20} className="text-gray-600 dark:text-gray-400" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <button
                                        onClick={link.action}
                                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Get In Touch</h4>
                        <ul className="space-y-4">
                            {contactInfo.map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <item.icon className="text-blue-500 dark:text-blue-400" />
                                    </div>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <span>{item.value}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Newsletter Signup */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Stay Updated</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Subscribe to get notified about my latest projects and blog posts.
                        </p>

                        <form onSubmit={handleSubscription} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={subscribeEmail}
                                    onChange={(e) => setSubscribeEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    disabled={isSubscribing}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubscribing}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                whileHover={{ scale: isSubscribing ? 1 : 1.02 }}
                                whileTap={{ scale: isSubscribing ? 1 : 0.98 }}
                            >
                                {isSubscribing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Subscribing...
                                    </>
                                ) : (
                                    'Subscribe'
                                )}
                            </motion.button>
                        </form>

                        {/* Subscription Status Message */}
                        {subscribeStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-3 p-3 rounded-xl flex items-center gap-3 text-sm ${
                                    subscribeStatus.type === 'success'
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                }`}
                            >
                                {subscribeStatus.type === 'success' ? (
                                    <FaCheck className="text-green-500 flex-shrink-0" />
                                ) : (
                                    <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                                )}
                                <span>{subscribeStatus.msg}</span>
                            </motion.div>
                        )}

                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-3">
                            No spam ever. Unsubscribe at any time.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-800 my-8"></div>

                {/* Bottom Bar */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-center gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Copyright */}
                    <motion.div
                        className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2 flex-wrap"
                        variants={itemVariants}
                    >
                        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
                    </motion.div>

                    {/* Additional Links */}
                    <motion.div
                        className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400"
                        variants={itemVariants}
                    >
                        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                            Privacy Policy
                        </button>
                        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                            Terms of Service
                        </button>
                        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                            Sitemap
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll to Top Button */}
            <motion.button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-50 p-3 bg-blue-500 text-white rounded-xl shadow-2xl hover:bg-blue-600 transition-colors duration-300 border border-blue-400/20"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <FaArrowUp size={16} />
            </motion.button>

            {/* Floating Particles */}
            <motion.div
                className="absolute bottom-20 left-10 w-2 h-2 bg-blue-400/30 dark:bg-blue-400/30 rounded-full"
                animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
            />
            <motion.div
                className="absolute top-20 right-20 w-1 h-1 bg-purple-400/30 dark:bg-purple-400/30 rounded-full"
                animate={{ y: [0, 15, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            />
            <motion.div
                className="absolute bottom-40 left-1/4 w-1 h-1 bg-cyan-400/30 dark:bg-cyan-400/30 rounded-full"
                animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            />
        </footer>
    )
}
