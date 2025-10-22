import React, { useState, useEffect } from 'react'
import { PROJECTS } from '../data'
import { FaGithub, FaExternalLinkAlt, FaCode, FaFilter, FaTimes, FaArrowRight, FaRegClock, FaCheck, FaSpinner } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Portfolio() {
    const [filter, setFilter] = useState('All')
    const [selectedProject, setSelectedProject] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Get unique categories
    const categories = ['All', ...new Set(PROJECTS.map(p => p.category))]

    // Filter projects based on selected category
    const filteredProjects = PROJECTS.filter(p =>
        filter === 'All' ? true : p.category === filter
    )

    // Status configuration with icons and colors
    const statusConfig = {
        'planned': {
            icon: FaRegClock,
            color: 'bg-blue-500 text-white',
            label: 'Planned'
        },
        'in progress': {
            icon: FaSpinner,
            color: 'bg-yellow-500 text-white',
            label: 'In Progress'
        },
        'completed': {
            icon: FaCheck,
            color: 'bg-green-500 text-white',
            label: 'Completed'
        }
    }

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
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    const filterVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4
            }
        }
    }

    const openProjectModal = (project) => {
        setSelectedProject(project)
        setIsModalOpen(true)
        document.body.style.overflow = 'hidden'
    }

    const closeProjectModal = () => {
        setIsModalOpen(false)
        setTimeout(() => setSelectedProject(null), 300)
        document.body.style.overflow = 'unset'
    }

    return (
        <section id="portfolio" className="section-padding relative overflow-hidden bg-gray-50 dark:bg-gray-900/50">
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-10 animate-float"></div>

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
                        <FaCode className="mr-2" />
                        My Work
                    </div>
                    <h2 className="section-title">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                    <p className="section-subtitle">
                        A collection of projects that showcase my skills in full-stack development,
                        problem-solving, and creating exceptional user experiences.
                    </p>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div
                    className="flex flex-wrap justify-center gap-3 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {categories.map((category, index) => (
                        <motion.button
                            key={category}
                            onClick={() => setFilter(category)}
                            variants={filterVariants}
                            className={`group relative px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                                filter === category
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm hover:shadow-md'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {filter === category && <FaFilter className="text-sm" />}
                            {category}
                            {filter === category && (
                                <motion.span
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-blue-500 -z-10"
                                    layoutId="activeFilter"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    key={filter}
                >
                    <AnimatePresence>
                        {filteredProjects.map((project, index) => {
                            const status = statusConfig[project.status?.toLowerCase()] || statusConfig['planned']
                            const StatusIcon = status?.icon || FaRegClock

                            return (
                                <motion.article
                                    key={project.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="card-hover group relative overflow-hidden"
                                    whileHover={{ y: -5 }}
                                    custom={index}
                                >
                                    {/* Project Image */}
                                    <div className="relative overflow-hidden h-48 bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {project.technologies.slice(0, 3).map(tech => (
                                                        <span
                                                            key={tech}
                                                            className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm text-white rounded"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {project.technologies.length > 3 && (
                                                        <span className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm text-white rounded">
                                                            +{project.technologies.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openProjectModal(project)}
                                                        className="flex-1 bg-white/20 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                                                    >
                                                        View Details
                                                    </button>

                                                    {project.github && (
                                                        <a
                                                            href={project.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <FaGithub size={14} />
                                                        </a>
                                                    )}

                                                    {project.live && (
                                                        <a
                                                            href={project.live}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <FaExternalLinkAlt size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badge with Icon */}
                                        {status && (
                                            <div className={`absolute top-3 right-3 px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                                                <StatusIcon
                                                    size={12}
                                                    className={project.status?.toLowerCase() === 'in progress' ? 'animate-spin' : ''}
                                                />
                                                <span className="hidden sm:inline">{status.label}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Content */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                                                {project.category}
                                            </span>
                                            <motion.div
                                                className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                whileHover={{ x: 5 }}
                                            >
                                                <FaArrowRight size={14} />
                                            </motion.div>
                                        </div>

                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                            {project.title}
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                            {project.description}
                                        </p>

                                        {/* Technologies */}
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.slice(0, 3).map(tech => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hover Border Effect */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500/20 rounded-xl transition-all duration-300 pointer-events-none"></div>
                                </motion.article>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <FaCode className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            No projects found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            No projects match the selected filter. Try selecting a different category or check back later for new projects.
                        </p>
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="card p-8 max-w-2xl mx-auto bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-100 dark:border-primary-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Interested in Working Together?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            I'm always excited to take on new challenges and collaborate on innovative projects.
                            Let's discuss how we can bring your ideas to life.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#contact"
                                className="btn-primary group"
                            >
                                Start a Project
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="mailto:pubudutharange@gmail.com"
                                className="btn-secondary"
                            >
                                Get In Touch
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedProject && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeProjectModal}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="relative h-64 bg-gradient-to-br from-primary-500 to-blue-500">
                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    className="w-full h-full object-cover"
                                />

                                <button
                                    onClick={closeProjectModal}
                                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <FaTimes size={16} />
                                </button>

                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.technologies.map(tech => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <span className="text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide text-sm">
                                            {selectedProject.category}
                                        </span>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            {selectedProject.title}
                                        </h2>
                                    </div>

                                    <div className="flex gap-3">
                                        {selectedProject.github && (
                                            <a
                                                href={selectedProject.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <FaGithub size={20} />
                                            </a>
                                        )}

                                        {selectedProject.live && (
                                            <a
                                                href={selectedProject.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <FaExternalLinkAlt size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                    {selectedProject.description}
                                </p>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Features */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h3>
                                        <ul className="space-y-2">
                                            {selectedProject.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Results */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Results & Impact</h3>
                                        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                                            <p className="text-primary-700 dark:text-primary-300">
                                                {selectedProject.results}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex justify-between items-center">
                                    {(() => {
                                        const status = statusConfig[selectedProject.status?.toLowerCase()] || statusConfig['planned']
                                        const StatusIcon = status?.icon || FaRegClock
                                        return (
                                            <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${status.color}`}>
                                                <StatusIcon
                                                    size={14}
                                                    className={selectedProject.status?.toLowerCase() === 'in progress' ? 'animate-spin' : ''}
                                                />
                                                {status.label}
                                            </span>
                                        )
                                    })()}

                                    <button
                                        onClick={closeProjectModal}
                                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                    >
                                        Close Project
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
