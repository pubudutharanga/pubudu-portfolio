import React, { useState, useEffect } from 'react'
import { SKILLS, SITE } from '../data'
import { FaDownload, FaCode, FaTools, FaUsers, FaAward, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function About({ dark }) {
    const [activeTab, setActiveTab] = useState('technical')

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

    const skillVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4
            }
        }
    }

    return (
        <section id="about" className="section-padding relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
                        <FaAward className="mr-2" />
                        About Me
                    </div>
                    <h2 className="section-title">
                        Crafting Digital <span className="gradient-text">Experiences</span>
                    </h2>
                    <p className="section-subtitle">
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Profile Image & Personal Info */}
                    <motion.div
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Profile Card */}
                        <motion.div
                            className="card p-8 text-center"
                            variants={itemVariants}
                        >
                            <div className="relative mb-6">
                                <div className="w-48 h-48 mx-auto relative">
                                    {/* Background Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>

                                    {/* Profile Image */}
                                    <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-full p-2 shadow-2xl border-4 border-white dark:border-gray-700">
                                        <img
                                            src={dark ? "./PT_dark.webp" : "./PT_light.webp"}
                                            alt="Pubudu Tharanga"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 animate-pulse"></div>
                                </div>
                            </div>

                            <motion.h3
                                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                                variants={itemVariants}
                            >
                                {SITE.name}
                            </motion.h3>

                            <motion.p
                                className="text-primary-600 dark:text-primary-400 font-medium mb-4"
                                variants={itemVariants}
                            >
                                {SITE.title}
                            </motion.p>

                            <motion.div
                                className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-6"
                                variants={itemVariants}
                            >
                                <FaMapMarkerAlt className="text-primary-500" />
                                <span>{SITE.location}</span>
                            </motion.div>

                            <motion.p
                                className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                                variants={itemVariants}
                            >
                                I am an undergraduate student at Sabaragamuwa University Of Sri Lanka,
                                pursuing a BSc Hons in Information Systems. Passionate about creating
                                innovative digital solutions that make a difference.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-3 justify-center"
                                variants={itemVariants}
                            >
                                <a
                                    href="/pubudu_resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary group flex items-center justify-center"
                                >
                                    <FaDownload className="mr-2 group-hover:scale-110 transition-transform" />
                                    Download Resume
                                </a>
                                <a
                                    href={`mailto:${SITE.email}`}
                                    className="btn-secondary flex items-center justify-center"
                                >
                                    Contact Me
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            className="grid grid-cols-3 gap-4"
                            variants={containerVariants}
                        >
                            <motion.div
                                className="card p-4 text-center"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="text-2xl font-bold gradient-text mb-1">1+</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Years Experience</div>
                            </motion.div>

                            <motion.div
                                className="card p-4 text-center"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="text-2xl font-bold gradient-text mb-1">3+</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Projects</div>
                            </motion.div>

                            <motion.div
                                className="card p-4 text-center"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <FaGraduationCap className="text-2xl text-primary-500 mx-auto mb-1" />
                                <div className="text-sm text-gray-500 dark:text-gray-400">Undergraduate</div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Skills & Details */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Skills Navigation */}
                        <motion.div
                            className="card p-2"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                {[
                                    { id: 'technical', label: 'Technical', icon: FaCode },
                                    { id: 'tools', label: 'Tools', icon: FaTools },
                                    { id: 'soft', label: 'Soft Skills', icon: FaUsers }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <tab.icon />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Skills Content */}
                        <motion.div
                            className="card p-6"
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {activeTab === 'technical' && 'Technical Skills'}
                                {activeTab === 'tools' && 'Tools & Technologies'}
                                {activeTab === 'soft' && 'Soft Skills'}
                            </h3>

                            <motion.div
                                className="flex flex-wrap gap-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {SKILLS[activeTab].map((skill, index) => (
                                    <motion.span
                                        key={skill}
                                        className="skill-badge group relative overflow-hidden"
                                        variants={skillVariants}
                                        custom={index}
                                        whileHover={{
                                            scale: 1.05,
                                            transition: { type: "spring", stiffness: 400 }
                                        }}
                                    >
                                        {skill}
                                        <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                    </motion.span>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Education & Background */}
                        <motion.div
                            className="card p-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <FaGraduationCap className="text-primary-500" />
                                Education & Background
                            </h3>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                            <FaGraduationCap className="text-primary-600 dark:text-primary-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            BSc Hons in Information Systems
                                        </h4>
                                        <p className="text-primary-600 dark:text-primary-400 text-sm">
                                            Sabaragamuwa University Of Sri Lanka
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                            Currently pursuing degree with focus on software development,
                                            database systems, and information technology management.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <FaCode className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Full Stack Development
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                            Specialized in modern web technologies including React, Node.js,
                                            and cloud platforms. Passionate about clean code and user experience.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Call to Action */}
                        <motion.div
                            className="card p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-100 dark:border-primary-800"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                Let's Build Something Amazing
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                I'm always interested in new opportunities and challenging projects.
                                Let's discuss how we can work together to bring your ideas to life.
                            </p>
                            <a
                                href={`mailto:${SITE.email}`}
                                className="btn-primary inline-flex items-center"
                            >
                                Start a Conversation
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
