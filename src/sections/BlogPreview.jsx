import React, { useState } from 'react'
import { BLOG_POSTS } from '../data'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaCalendar, FaClock, FaTags, FaEye } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function BlogPreview() {
    const [hoveredPost, setHoveredPost] = useState(null)
    const posts = BLOG_POSTS.slice(0, 3)

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
            y: -10,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    }

    const imageHoverVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    return (
        <section id="blog" className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-10 animate-float"></div>

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <FaTags className="mr-2" />
                        Latest Articles
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        From the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Blog</span>
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Discover my latest thoughts on web development, design trends, and technology insights.
                        Stay updated with practical tutorials and industry analysis.
                    </motion.p>
                </motion.div>

                {/* Blog Posts Grid */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            variants={itemVariants}
                            className="group relative"
                            onMouseEnter={() => setHoveredPost(post.id)}
                            onMouseLeave={() => setHoveredPost(null)}
                            whileHover="hover"
                            initial="initial"
                        >
                            {/* Main Card */}
                            <motion.div
                                variants={cardHoverVariants}
                                className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
                                    <motion.img
                                        src={post.featured}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                        variants={imageHoverVariants}
                                    />

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-lg backdrop-blur-sm">
                      {post.category}
                    </span>
                                    </div>

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileHover={{ opacity: 1, y: 0 }}
                                                className="flex justify-center"
                                            >
                                                <Link
                                                    to={`/blog/${post.id}`}
                                                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
                                                >
                                                    Read Article
                                                    <FaArrowRight size={12} />
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* View Indicator */}
                                    <motion.div
                                        className="absolute top-4 right-4 flex items-center gap-1 text-white/80 text-xs"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                    >
                                        <FaEye size={10} />
                                        <span>Read</span>
                                    </motion.div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Metadata */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        <div className="flex items-center gap-1">
                                            <FaCalendar size={12} />
                                            <span>{new Date(post.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaClock size={12} />
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                                        {post.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>

                                    {/* Tags */}
                                    {post.tags && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.slice(0, 2).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                                                >
                          #{tag}
                        </span>
                                            ))}
                                            {post.tags.length > 2 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          +{post.tags.length - 2}
                        </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Read More Link */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                PT
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Pubudu Tharanga</span>
                                        </div>

                                        <Link
                                            to={`/blog/${post.id}`}
                                            className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
                                        >
                                            Read More
                                            <motion.span
                                                animate={{ x: hoveredPost === post.id ? 5 : 0 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <FaArrowRight size={14} />
                                            </motion.span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Hover Border Effect */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                            </motion.div>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-center text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer bg-[length:200%_100%]"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Want More Insights?
                            </h3>
                            <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
                                Explore my complete blog for in-depth tutorials, case studies, and the latest
                                trends in web development and design.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/blog"
                                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2 text-lg"
                                >
                                    View All Articles
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="#contact"
                                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors duration-300 text-lg"
                                >
                                    Get Updates
                                </a>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            className="absolute top-4 left-4 w-6 h-6 bg-white/20 rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute bottom-4 right-4 w-4 h-4 bg-white/20 rounded-full"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                    </div>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    className="grid grid-cols-3 gap-8 mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            {BLOG_POSTS.length}+
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Articles Published</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            5min+
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Avg Read Time</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            100%
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Original Content</div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
