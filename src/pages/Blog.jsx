import React, { useState, useEffect } from 'react'
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data'
import { Link } from 'react-router-dom'
import { FaSearch, FaCalendar, FaClock, FaArrowRight, FaFilter, FaTags, FaUser, FaArrowLeft, FaShare } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Blog() {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('All')
    const [visible, setVisible] = useState(6)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(null)

    // Filter posts based on search and category
    const filteredPosts = BLOG_POSTS
        .filter(p => category === 'All' ? true : p.category === category)
        .filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )

    // Share functionality
    const handleShare = async (post, platform = 'copy') => {
        const postUrl = `${window.location.href}/${post.id}`
        const shareText = `Check out this article: ${post.title}`
        
        try {
            switch (platform) {
                case 'x':
                    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`, '_blank')
                    break
                case 'linkedin':
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank')
                    break
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank')
                    break
                case 'copy':
                    await navigator.clipboard.writeText(postUrl)
                    // You could add a toast notification here
                    console.log('URL copied to clipboard!')
                    break
                case 'native':
                    if (navigator.share) {
                        await navigator.share({
                            title: post.title,
                            text: post.excerpt,
                            url: postUrl,
                        })
                    } else {
                        // Fallback to copy if Web Share API not supported
                        await navigator.clipboard.writeText(postUrl)
                    }
                    break
                default:
                    break
            }
        } catch (error) {
            console.error('Error sharing:', error)
        }
        
        // Close share menu after action
        setShowShareMenu(null)
    }

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showShareMenu && !event.target.closest('.share-container')) {
                setShowShareMenu(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showShareMenu])

    // Reset visible posts when filters change
    useEffect(() => {
        setVisible(6)
    }, [query, category])

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

    const searchVariants = {
        focused: {
            scale: 1.02,
            boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.3 }
        },
        unfocused: {
            scale: 1,
            boxShadow: "0 4px 20px -5px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.3 }
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
            {/* Hero Section for Blog */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-10 animate-float"></div>

                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                            <FaTags className="mr-2" />
                            Blog & Articles
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Latest <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Insights</span>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Discover articles, tutorials, and industry insights about web development,
                            design trends, and technology innovations.
                        </p>

                        {/* Back to Home */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                            >
                                <FaArrowLeft size={14} />
                                Back to Home
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Blog Content */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Search and Filter Section */}
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="grid md:grid-cols-2 gap-6 items-end">
                            {/* Search Input */}
                            <motion.div
                                variants={searchVariants}
                                animate={isSearchFocused ? "focused" : "unfocused"}
                                className="relative"
                            >
                                <div className="relative">
                                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        placeholder="Search articles, tutorials, insights..."
                                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                                    />
                                </div>
                            </motion.div>

                            {/* Category Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <FaFilter size={12} />
                                    Filter by Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="px-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300 appearance-none cursor-pointer"
                                >
                                    {BLOG_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Results Count */}
                        <motion.div
                            className="mt-4 text-sm text-gray-600 dark:text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                            {query && ` for "${query}"`}
                            {category !== 'All' && ` in ${category}`}
                        </motion.div>
                    </motion.div>

                    {/* Blog Posts Grid */}
                    <AnimatePresence mode="wait">
                        {filteredPosts.length > 0 ? (
                            <motion.div
                                key={`${query}-${category}`}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredPosts.slice(0, visible).map((post, index) => (
                                    <motion.article
                                        key={post.id}
                                        variants={itemVariants}
                                        className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
                                        whileHover={{
                                            y: -8,
                                            transition: { type: "spring", stiffness: 400, damping: 25 }
                                        }}
                                    >
                                        {/* Featured Image */}
                                        <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
                                            <img
                                                src={post.featured}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-lg">
                                                    {post.category}
                                                </span>
                                            </div>

                                            {/* Overlay Gradient */}
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
                                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            {/* Tags */}
                                            {post.tags && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.tags.slice(0, 3).map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Author, Share & Read More */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        PT
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Pubudu Tharanga</span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {/* Share Button */}
                                                    <div className="relative share-container">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                setShowShareMenu(showShareMenu === post.id ? null : post.id)
                                                            }}
                                                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 group"
                                                            aria-label="Share article"
                                                        >
                                                            <FaShare size={14} />
                                                        </button>

                                                        {/* Share Dropdown Menu */}
                                                        <AnimatePresence>
                                                            {showShareMenu === post.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden"
                                                                >
                                                                    <div className="p-2">
                                                                        {/* Native Share (Mobile) */}
                                                                        {navigator.share && (
                                                                            <button
                                                                                onClick={() => handleShare(post, 'native')}
                                                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                                                            >
                                                                                <FaShare size={12} />
                                                                                Share via...
                                                                            </button>
                                                                        )}
                                                                        
                                                                        {/* X (Twitter) */}
                                                                        <button
                                                                            onClick={() => handleShare(post, 'x')}
                                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                                                        >
                                                                            <svg className="w-4 h-4 text-gray-900 dark:text-gray-100" fill="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                                            </svg>
                                                                            X (Twitter)
                                                                        </button>
                                                                        
                                                                        {/* LinkedIn */}
                                                                        <button
                                                                            onClick={() => handleShare(post, 'linkedin')}
                                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                                                        >
                                                                            <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                                            </svg>
                                                                            LinkedIn
                                                                        </button>
                                                                        
                                                                        {/* Facebook */}
                                                                        <button
                                                                            onClick={() => handleShare(post, 'facebook')}
                                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                                                        >
                                                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                                            </svg>
                                                                            Facebook
                                                                        </button>
                                                                        
                                                                        {/* Copy Link */}
                                                                        <button
                                                                            onClick={() => handleShare(post, 'copy')}
                                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                                                        >
                                                                            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                            </svg>
                                                                            Copy Link
                                                                        </button>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* Read More Link */}
                                                    <Link
                                                        to={`/blog/${post.id}`}
                                                        className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
                                                    >
                                                        Read More
                                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Border Effect */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                                    </motion.article>
                                ))}
                            </motion.div>
                        ) : (
                            /* Empty State */
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="text-center py-16"
                            >
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <FaSearch className="text-3xl text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    No articles found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                                    {query
                                        ? `No articles match your search for "${query}". Try different keywords or browse all categories.`
                                        : `No articles available in the "${category}" category yet. Check back soon!`
                                    }
                                </p>
                                {(query || category !== 'All') && (
                                    <button
                                        onClick={() => {
                                            setQuery('')
                                            setCategory('All')
                                        }}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        View All Articles
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Load More Button */}
                    {visible < filteredPosts.length && (
                        <motion.div
                            className="text-center mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <button
                                onClick={() => setVisible(v => v + 6)}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Load More Articles
                            </button>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                                Showing {Math.min(visible, filteredPosts.length)} of {filteredPosts.length} articles
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    )
}