import React, { useState, useEffect } from 'react'
import { FaLinkedin, FaGithub, FaFacebook, FaArrowDown, FaDownload } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { Particles, SplashCursor, ClickSpark, StarBorder } from '../components/reactbits'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Hero({ site, dark }) {
    const navigate = useNavigate()

    // Track if Hero section is visible for SplashCursor
    const [heroRef, isHeroVisible] = useInView({
        threshold: 0.5, // 50% of Hero must be visible
        triggerOnce: false,
    })


    // Responsive particle count based on screen size
    const [particleCount, setParticleCount] = useState(dark ? 90 : 30)

    useEffect(() => {
        const updateParticleCount = () => {
            const width = window.innerWidth
            if (width < 640) {
                // Mobile: minimal particles
                setParticleCount(dark ? 25 : 12)
            } else if (width < 1024) {
                // Tablet: moderate particles
                setParticleCount(dark ? 50 : 20)
            } else {
                // Desktop: full experience
                setParticleCount(dark ? 90 : 30)
            }
        }

        updateParticleCount()
        window.addEventListener('resize', updateParticleCount)
        return () => window.removeEventListener('resize', updateParticleCount)
    }, [dark])

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const socialLinks = [
        { icon: FaLinkedin, href: site.linkedin, label: 'LinkedIn', color: 'hover:text-blue-600', starColor: '#0077B5' },
        { icon: FaGithub, href: site.github, label: 'GitHub', color: 'hover:text-gray-900 dark:hover:text-white', starColor: '#6e5494' },
        { icon: FaFacebook, href: site.facebook, label: 'Facebook', color: 'hover:text-blue-500', starColor: '#1877F2' },
    ]

    // Premium staggered animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.3,
            }
        }
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: 'blur(10px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
            }
        }
    }

    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: 90,
        },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.6,
                delay: i * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
            }
        })
    }

    // Split text helper - applies gradient to each word for proper visibility
    const AnimatedText = ({ text, className, isGradient = false }) => {
        const words = text.split(' ')
        return (
            <span className={!isGradient ? className : 'block'}>
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        custom={i}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        className={`inline-block mr-[0.3em] ${isGradient ? 'bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent' : ''}`}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {word}
                    </motion.span>
                ))}
            </span>
        )
    }

    return (
        <section ref={heroRef} id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Splash Cursor - Only in dark mode AND when Hero is visible */}
            {dark && isHeroVisible && <SplashCursor />}

            {/* Particle Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
                <Particles
                    dark={dark}
                    particleCount={particleCount}
                    particleColors={['#0ea5e9', '#38bdf8', '#7dd3fc', '#818cf8', '#a78bfa']}
                    connectionDistance={window.innerWidth < 640 ? 100 : 140}
                    mouseRadius={window.innerWidth < 640 ? 100 : 150}
                    mouseForce={0.1}
                    speed={0.4}
                    particleMinSize={1}
                    particleMaxSize={window.innerWidth < 640 ? 2 : 3}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-200/30 via-transparent to-transparent dark:from-primary-900/20"></div>
            </div>

            {/* Floating Elements - Enhanced */}
            <motion.div
                className="hidden sm:block absolute top-20 left-10 w-4 h-4 bg-primary-500/80 rounded-full blur-[1px]"
                animate={{
                    y: [-5, 5, -5],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="hidden sm:block absolute top-40 right-20 w-6 h-6 bg-blue-400/60 rounded-full blur-[1px]"
                animate={{
                    y: [5, -5, 5],
                    x: [-3, 3, -3],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
                className="hidden sm:block absolute bottom-40 left-20 w-3 h-3 bg-indigo-500/70 rounded-full blur-[1px]"
                animate={{
                    y: [-8, 8, -8],
                    rotate: [0, 180, 360],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
                className="hidden sm:block absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400/80 rounded-full"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Content */}
                <div>
                    {/* Badge with StarBorder */}
                    <motion.div variants={itemVariants}>
                        <StarBorder
                            as="div"
                            color="#0ea5e9"
                            speed="5s"
                            className="mb-4 sm:mb-6"
                        >
                            <div className="flex items-center px-4 py-2 text-primary-700 dark:text-primary-300 text-sm font-medium">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                                Hello, I'm {site.name} 👋
                            </div>
                        </StarBorder>
                    </motion.div>

                    {/* Main Heading - Premium Split Text Animation */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                    >
                        <AnimatedText text="Full Stack" isGradient={true} />
                        <AnimatedText text="Developer" className="text-gray-900 dark:text-white block" />
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg"
                    >
                        I design and build exceptional digital experiences that are fast, accessible, and user-friendly.
                        Currently pursuing my degree while creating innovative web solutions.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
                        <motion.button
                            onClick={() => scrollToSection('portfolio')}
                            className="btn-primary group flex items-center justify-center w-full sm:w-auto"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            View My Work
                            <FaArrowDown className="ml-2 group-hover:translate-y-1 transition-transform" />
                        </motion.button>

                        <div className="flex gap-3 sm:gap-4">
                            <motion.button
                                onClick={() => scrollToSection('contact')}
                                className="btn-secondary flex-1 sm:flex-initial"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Get In Touch
                            </motion.button>

                            <StarBorder
                                as="a"
                                href="/pubudu_resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="#a855f7"
                                speed="4s"
                                className="flex-1 sm:flex-initial"
                            >
                                <div className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    <FaDownload />
                                    <span className="hidden xs:inline">Resume</span>
                                    <span className="xs:hidden">CV</span>
                                </div>
                            </StarBorder>
                        </div>
                    </motion.div>

                    {/* Social Links & Status */}
                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="flex gap-3">
                            {socialLinks.map(({ icon: Icon, href, label, color, starColor }, index) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                >
                                    <StarBorder
                                        as="a"
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color={starColor}
                                        speed="5s"
                                        aria-label={label}
                                    >
                                        <div className={`p-2.5 sm:p-3 text-gray-600 dark:text-gray-400 ${color} transition-colors duration-300`}>
                                            <Icon size={18} className="sm:w-5 sm:h-5" />
                                        </div>
                                    </StarBorder>
                                </motion.div>
                            ))}
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

                        <motion.div
                            className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="hidden xs:inline">Available for projects</span>
                            <span className="xs:hidden">Available</span>
                        </motion.div>
                    </motion.div>


                </div>

                {/* Profile Image */}
                <motion.div
                    className="relative hidden lg:block"
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <motion.div
                        className="relative"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="w-80 h-80 lg:w-96 lg:h-96 mx-auto">
                            {/* Background Glow - Enhanced */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full blur-3xl opacity-25"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.2, 0.3, 0.2],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Main Image Container */}
                            <div className="relative w-full h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-8 shadow-2xl border-8 border-white/80 dark:border-gray-700/80">
                                <img
                                    src={dark ? "./PT_dark.webp" : "./PT_light.webp"}
                                    alt="Pubudu Tharanga - Full Stack Developer"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </div>

                        {/* Experience Badge */}
                        <motion.div
                            className="absolute -bottom-4 -right-4 card p-4 transform backdrop-blur-sm bg-white/90 dark:bg-gray-800/90"
                            initial={{ opacity: 0, scale: 0, rotate: 20 }}
                            animate={{ opacity: 1, scale: 1, rotate: 6 }}
                            transition={{ delay: 1, duration: 0.5, type: "spring" }}
                            whileHover={{ scale: 1.1, rotate: 0 }}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold gradient-text">1+</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Years Experience</div>
                            </div>
                        </motion.div>

                        {/* Technology Badge */}
                        <motion.div
                            className="absolute -top-4 -left-4 card p-3 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90"
                            initial={{ opacity: 0, scale: 0, rotate: -20 }}
                            animate={{ opacity: 1, scale: 1, rotate: -6 }}
                            transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                            whileHover={{ scale: 1.1, rotate: 0 }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Open Source</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
            >
                <motion.button
                    onClick={() => scrollToSection('about')}
                    className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
                    aria-label="Scroll down to learn more"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.1 }}
                >
                    <FaArrowDown className="text-gray-600 dark:text-gray-400" />
                </motion.button>
            </motion.div>
        </section>
    )
}

