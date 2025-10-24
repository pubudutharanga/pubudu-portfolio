import React, { useState } from 'react'
import { SERVICES } from '../data'
import { FaCode, FaPalette, FaRocket, FaCheck, FaArrowRight, FaStar, FaClock, FaUsers, FaAward } from 'react-icons/fa'
import { HashLink } from 'react-router-hash-link';

export default function Services() {
    const [selectedService, setSelectedService] = useState(0)
    const [isHovered, setIsHovered] = useState(null)

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    }

    const cardHoverVariants = {
        initial: { scale: 1, y: 0 },
        hover: {
            scale: 1.05,
            y: -8,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    }

    const serviceIcons = {
        'Web Development': FaCode,
        'UI/UX Design': FaPalette,
        'Consulting': FaRocket
    }

    return (
        <section id="services" className="py-20 px-4 bg-white dark:bg-gray-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-15 animate-pulse"></div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                        <FaRocket className="mr-2" />
                        What I Offer
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Professional <span className="text-blue-600">Services</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                        Comprehensive solutions tailored to bring your digital vision to life.
                        From concept to deployment, I ensure exceptional quality and performance.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {SERVICES.map((service, index) => {
                        const IconComponent = serviceIcons[service.title] || FaCode
                        const isSelected = selectedService === index
                        const isHoveredCard = isHovered === index

                        return (
                            <div
                                key={service.title}
                                className="relative group cursor-pointer"
                                onMouseEnter={() => setIsHovered(index)}
                                onMouseLeave={() => setIsHovered(null)}
                                onClick={() => setSelectedService(index)}
                            >
                                {/* Main Service Card */}
                                <div className={`relative overflow-hidden rounded-2xl p-8 h-full border-2 transition-all duration-500 ${
                                    isSelected
                                        ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-500 shadow-2xl shadow-blue-500/25'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl'
                                }`}>

                                    {/* Animated Border */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                                        isSelected && 'opacity-100'
                                    }`}></div>
                                    <div className="absolute inset-[2px] rounded-2xl bg-white dark:bg-gray-800"></div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div className={`inline-flex p-4 rounded-2xl mb-6 transition-colors duration-300 ${
                                            isSelected
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        }`}>
                                            <IconComponent size={24} />
                                        </div>

                                        {/* Title */}
                                        <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                                            isSelected
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-900 dark:text-white'
                                        }`}>
                                            {service.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                            {service.description}
                                        </p>

                                        {/* Features */}
                                        <ul className="space-y-3 mb-8">
                                            {service.features.slice(0, 3).map((feature, i) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-center gap-3 text-sm"
                                                >
                                                    <FaCheck className={`flex-shrink-0 ${
                                                        isSelected
                                                            ? 'text-blue-500'
                                                            : 'text-green-500'
                                                    }`} size={14} />
                                                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button */}
                                        <button
                                            className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            Get Started
                                            <FaArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Glow Effect */}
                                <div className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ${
                                    isSelected
                                        ? 'bg-blue-500/20 opacity-100'
                                        : 'bg-blue-500/10 opacity-0 group-hover:opacity-50'
                                }`}></div>
                            </div>
                        )
                    })}
                </div>

                {/* Detailed Service View */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <div className="space-y-6">
                            <div>
                <span className="text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide text-sm">
                  Service Details
                </span>
                                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
                                    {SERVICES[selectedService].title}
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {SERVICES[selectedService].description}
                                </p>
                            </div>

                            {/* All Features */}
                            <div className="space-y-4">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaCheck className="text-green-500" />
                                    What's Included
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {SERVICES[selectedService].features.map((feature, index) => (
                                        <div
                                            key={feature}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                        >
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Service Benefits */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <FaClock className="text-blue-500" />
                                    Fast Delivery
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <FaUsers className="text-blue-500" />
                                    Client Collaboration
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <FaAward className="text-blue-500" />
                                    Quality Guarantee
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <FaStar className="text-blue-500" />
                                    Premium Support
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <HashLink
                                    smooth to="/#contact"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    Start Your Project
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </HashLink>
                                <a
                                    href="mailto:pubudutharange@gmail.com"
                                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center"
                                >
                                    Schedule Consultation
                                </a>
                            </div>
                        </div>

                        {/* Visual Element */}
                        <div className="relative">
                            <div className="relative w-full h-64 lg:h-80 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl overflow-hidden">

                                {/* Service-specific Illustration */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <div className="text-6xl mb-4">
                                            {selectedService === 0 && <FaCode />}
                                            {selectedService === 1 && <FaPalette />}
                                            {selectedService === 2 && <FaRocket />}
                                        </div>
                                        <p className="text-xl font-semibold">Premium Quality</p>
                                        <p className="text-white/80 mt-2">Tailored to Your Needs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                                <div className="text-center">
                                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">100%</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Client Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-20">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 max-w-3xl mx-auto">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to Start Your Project?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                            Let's collaborate to bring your ideas to life with cutting-edge solutions
                            and exceptional user experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <HashLink
                                smooth to="/#contact"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-colors duration-300 text-lg flex items-center justify-center gap-2"
                            >
                                Get Free Consultation
                                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </HashLink>
                            <HashLink
                                smooth to="/#portfolio"
                                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-medium transition-colors duration-300 text-lg"
                            >
                                View My Work
                            </HashLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
