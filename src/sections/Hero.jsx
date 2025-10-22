import React from 'react'
import { FaLinkedin, FaGithub, FaFacebook, FaArrowDown, FaDownload } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function Hero({ site }) {
    const navigate = useNavigate()

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const socialLinks = [
        { icon: FaLinkedin, href: site.linkedin, label: 'LinkedIn', color: 'hover:text-blue-600' },
        { icon: FaGithub, href: site.github, label: 'GitHub', color: 'hover:text-gray-900 dark:hover:text-white' },
        { icon: FaFacebook, href: site.facebook, label: 'Facebook', color: 'hover:text-blue-500' },
    ]

    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-200/30 via-transparent to-transparent dark:from-primary-900/20"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-4 h-4 bg-primary-500 rounded-full animate-float opacity-60"></div>
            <div className="absolute top-40 right-20 w-6 h-6 bg-blue-400 rounded-full animate-float opacity-40 animation-delay-2000"></div>
            <div className="absolute bottom-40 left-20 w-3 h-3 bg-indigo-500 rounded-full animate-float opacity-70 animation-delay-1000"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse-slow"></div>

            <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center z-10">
                {/* Content */}
                <div className="animate-slide-up">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6 shadow-sm">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                        Hello, I'm {site.name} 👋
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        <span className="gradient-text">Full Stack</span>
                        <br />
                        <span className="text-gray-900 dark:text-white">Developer</span>
                    </h1>

                    {/* Tagline */}
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                        I design and build exceptional digital experiences that are fast, accessible, and user-friendly.
                        Currently pursuing my degree while creating innovative web solutions.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <button
                            onClick={() => scrollToSection('portfolio')}
                            className="btn-primary group flex items-center justify-center"
                        >
                            View My Work
                            <FaArrowDown className="ml-2 group-hover:translate-y-1 transition-transform" />
                        </button>

                        <div className="flex gap-4">
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="btn-secondary flex-1"
                            >
                                Get In Touch
                            </button>

                            <a
                                href={site.resume}
                                download
                                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 flex items-center gap-2"
                            >
                                <FaDownload />
                                Resume
                            </a>
                        </div>
                    </div>

                    {/* Social Links & Status */}
                    <div className="flex items-center gap-6">
                        <div className="flex gap-4">
                            {socialLinks.map(({ icon: Icon, href, label, color }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-gray-600 dark:text-gray-400 ${color}`}
                                    aria-label={label}
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>

                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Available for projects
                        </div>
                    </div>
                </div>

                {/* Profile Image */}
                <div className="relative animate-float hidden lg:block">
                    <div className="relative">
                        <div className="w-80 h-80 lg:w-96 lg:h-96 mx-auto">
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                            {/* Main Image Container */}
                            <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-full p-8 shadow-2xl border-8 border-white dark:border-gray-700">
                                <img
                                    src="./PT.png"
                                    alt="Pubudu Tharanga - Full Stack Developer"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </div>

                        {/* Experience Badge */}
                        <div className="absolute -bottom-4 -right-4 card p-4 transform rotate-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold gradient-text">1+</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Years Experience</div>
                            </div>
                        </div>

                        {/* Technology Badge */}
                        <div className="absolute -top-4 -left-4 card p-3 transform -rotate-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Open Source</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
                <button
                    onClick={() => scrollToSection('about')}
                    className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
                    aria-label="Scroll down to learn more"
                >
                    <FaArrowDown className="text-gray-600 dark:text-gray-400" />
                </button>
            </div>
        </section>
    )
}
