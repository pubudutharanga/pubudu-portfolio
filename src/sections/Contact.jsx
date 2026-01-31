import React, { useState } from 'react'
import { SITE } from '../data'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheck, FaLinkedin, FaGithub, FaFacebook, FaClock } from 'react-icons/fa'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [status, setStatus] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Replace these with your actual EmailJS credentials
    const EMAILJS_CONFIG = {
        SERVICE_ID: 'service_w531vvm', // Replace with your Service ID
        TEMPLATE_ID: 'template_4gmk22r', // Replace with your Template ID
        PUBLIC_KEY: 'jv9WZymPcXR2GtfFA' // Replace with your Public Key
    }

    const submit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simple validation
        if (!form.name || !form.email || !form.message) {
            setStatus({ type: 'error', msg: 'Please fill all required fields.' })
            setIsSubmitting(false)
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.email)) {
            setStatus({ type: 'error', msg: 'Please enter a valid email address.' })
            setIsSubmitting(false)
            return
        }

        try {
            // Prepare template parameters
            const templateParams = {
                from_name: form.name,
                from_email: form.email,
                subject: form.subject || `New message from ${form.name}`,
                message: form.message,
                to_name: SITE.name,
                reply_to: form.email,
                date: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }

            // Send email using EmailJS
            const result = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            )

            console.log('Email sent successfully:', result)

            // Success handling
            setStatus({
                type: 'success',
                msg: 'Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours!'
            })
            setForm({ name: '', email: '', subject: '', message: '' })

        } catch (error) {
            console.error('Email error:', error)

            // Error handling
            if (error.text) {
                setStatus({
                    type: 'error',
                    msg: 'Sorry, there was an error sending your message. Please try again or email me directly at ' + SITE.email
                })
            } else {
                setStatus({
                    type: 'error',
                    msg: 'Network error. Please check your connection and try again.'
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    // Animation variants with blur-fade for premium feel
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            }
        }
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 25,
            filter: 'blur(6px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    }

    const socialLinks = [
        { icon: FaLinkedin, href: SITE.linkedin, label: 'LinkedIn', color: 'hover:text-blue-600 dark:hover:text-blue-400' },
        { icon: FaGithub, href: SITE.github, label: 'GitHub', color: 'hover:text-gray-900 dark:hover:text-gray-300' },
        { icon: FaFacebook, href: SITE.facebook, label: 'Facebook', color: 'hover:text-blue-500 dark:hover:text-blue-400' },
    ]

    return (
        <section id="contact" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-10 animate-float"></div>

            <div className="relative max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div
                        className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <FaPaperPlane className="mr-2" />
                        Get In Touch
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Let's <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Work Together</span>
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
                        I'm always open to new opportunities and collaborations.
                    </motion.p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        className="card p-8"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send me a message</h3>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Your Message *
                                </label>
                                <textarea
                                    id="message"
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    rows="6"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 resize-none"
                                    placeholder="Tell me about your project..."
                                    required
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary group relative overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>

                                {/* Animated background */}
                                {isSubmitting && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    />
                                )}
                            </motion.button>

                            {/* Status Message */}
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success'
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                        }`}
                                >
                                    {status.type === 'success' ? (
                                        <FaCheck className="text-green-500 flex-shrink-0" />
                                    ) : (
                                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                                    )}
                                    <span className="text-sm">{status.msg}</span>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Contact Cards */}
                        <motion.div variants={itemVariants} className="card p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                        <FaEnvelope className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                                        <a
                                            href={`mailto:${SITE.email}`}
                                            className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {SITE.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                        <FaPhone className="text-green-600 dark:text-green-400 text-xl" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                                        <a
                                            href={`tel:${SITE.phone}`}
                                            className="text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                        >
                                            {SITE.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                        <FaMapMarkerAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                                        <div className="text-gray-900 dark:text-white font-medium">{SITE.location}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                                        <FaClock className="text-yellow-600 dark:text-yellow-400 text-xl" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Availability</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-gray-900 dark:text-white font-medium">Available for projects</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div variants={itemVariants} className="card p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Follow Me</h3>

                            <div className="flex gap-4">
                                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 ${color} border border-gray-200 dark:border-gray-700`}
                                        aria-label={label}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon size={24} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Response Time Card */}
                        <motion.div
                            variants={itemVariants}
                            className="card p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <FaPaperPlane className="text-blue-600 dark:text-blue-400 text-2xl" />
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Quick Response</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    I typically respond within 24 hours. Let's start the conversation!
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-3xl p-8 text-center text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer bg-[length:200%_100%]"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Ready to Start Your Project?
                            </h3>
                            <p className="text-blue-100 dark:text-blue-200 mb-6 text-lg max-w-2xl mx-auto">
                                Let's collaborate to create something extraordinary. I'm excited to hear about your ideas and help bring them to life.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {/* Email Button with Dark Mode */}
                                <motion.a
                                    href={`mailto:${SITE.email}`}
                                    className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center gap-2 text-lg shadow-lg border border-gray-200 dark:border-gray-600"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaEnvelope />
                                    Email Me Directly
                                </motion.a>

                                {/* Enhanced Call Me Button with Dark Mode */}
                                <motion.a
                                    href={`tel:${SITE.phone}`}
                                    className="relative bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden group flex items-center justify-center gap-3 text-lg shadow-lg shadow-green-500/25 dark:shadow-green-600/20"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {/* Animated background for hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-700 dark:to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Pulse ring effect - adjusted for dark mode */}
                                    <div className="absolute inset-0 rounded-xl border-2 border-green-400/50 dark:border-green-300/40 group-hover:border-green-300/70 dark:group-hover:border-green-200/60 transition-all duration-300 animate-pulse"></div>

                                    <span className="relative z-10 flex items-center gap-3">
                                        <div className="relative">
                                            <FaPhone className="text-white" />
                                            <motion.div
                                                className="absolute inset-0 text-white opacity-0 group-hover:opacity-100"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <FaPhone />
                                            </motion.div>
                                        </div>
                                        Call Now
                                    </span>
                                </motion.a>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            className="absolute top-4 left-4 w-6 h-6 bg-white/20 dark:bg-white/10 rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute bottom-4 right-4 w-4 h-4 bg-white/20 dark:bg-white/10 rounded-full"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
