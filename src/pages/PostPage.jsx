import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { BLOG_POSTS } from '../data'
import { FaCalendar, FaClock, FaArrowLeft, FaShare, FaUser, FaTag, FaBookmark, FaCheck, FaArrowRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function PostPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const post = BLOG_POSTS.find(p => p.id === parseInt(id) || p.id === id)
    const [progress, setProgress] = useState(0)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const shareMenuRef = useRef(null)

    // Improved scroll progress tracking
    useEffect(() => {
        const onScroll = () => {
            const el = document.getElementById('post-content')
            if (!el) return

            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100

            setProgress(Math.max(0, Math.min(100, scrollPercent)))
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showShareMenu &&
                shareMenuRef.current &&
                !shareMenuRef.current.contains(event.target) &&
                !event.target.closest('.share-trigger')) {
                setShowShareMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [showShareMenu])

    // Enhanced share functionality
    const handleShare = async (platform = 'copy') => {
        const postUrl = window.location.href
        const shareText = post ? `Check out this article: ${post.title}` : 'Check out this article'

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
                    try {
                        if (navigator.clipboard && window.isSecureContext) {
                            await navigator.clipboard.writeText(postUrl)
                        } else {
                            // Fallback for older browsers
                            const textArea = document.createElement('textarea')
                            textArea.value = postUrl
                            document.body.appendChild(textArea)
                            textArea.focus()
                            textArea.select()
                            document.execCommand('copy')
                            document.body.removeChild(textArea)
                        }

                        setIsCopied(true)
                        setTimeout(() => setIsCopied(false), 2000)

                    } catch (error) {
                        console.error('Failed to copy: ', error)
                        // Fallback: show URL in prompt
                        prompt('Copy this URL:', postUrl)
                    }
                    break
                case 'native':
                    if (navigator.share) {
                        await navigator.share({
                            title: post.title,
                            text: post.excerpt,
                            url: postUrl,
                        })
                    } else {
                        await handleShare('copy')
                    }
                    break
                default:
                    break
            }
        } catch (error) {
            console.error('Error sharing:', error)
        }

        setShowShareMenu(false)
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

    const shareMenuVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 10,
            transition: { duration: 0.2 }
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 10,
            transition: { duration: 0.2 }
        }
    }

    const bookmarkVariants = {
        initial: { scale: 1 },
        tapped: { scale: 0.9 },
        bookmarked: { scale: 1.1 }
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center px-4">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h2>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                        <FaArrowLeft size={14} />
                        Back to Blog
                    </Link>
                </motion.div>
            </div>
        )
    }

    // Share Button Component
    const ShareButton = () => (
        <div className="relative" ref={shareMenuRef}>
            <motion.button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className={`share-trigger p-3 rounded-xl transition-colors duration-300 flex items-center gap-2 ${isCopied
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Share article"
            >
                {isCopied ? <FaCheck size={16} /> : <FaShare size={16} />}
                <span className="hidden sm:inline text-sm font-medium">
                    {isCopied ? 'Copied!' : 'Share'}
                </span>
            </motion.button>

            {/* Share Dropdown Menu */}
            <AnimatePresence>
                {showShareMenu && (
                    <motion.div
                        variants={shareMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                        <div className="p-2">
                            {/* Native Share (Mobile) */}
                            {navigator.share && (
                                <motion.button
                                    onClick={() => handleShare('native')}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaShare size={12} />
                                    Share via...
                                </motion.button>
                            )}

                            {/* X (Twitter) */}
                            <motion.button
                                onClick={() => handleShare('x')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-4 h-4 text-gray-900 dark:text-gray-100" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                X (Twitter)
                            </motion.button>

                            {/* LinkedIn */}
                            <motion.button
                                onClick={() => handleShare('linkedin')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </motion.button>

                            {/* Facebook */}
                            <motion.button
                                onClick={() => handleShare('facebook')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </motion.button>

                            {/* Copy Link */}
                            <motion.button
                                onClick={() => handleShare('copy')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-3"
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                {isCopied ? 'Copied!' : 'Copy Link'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
                <motion.div
                    style={{ width: `${progress}%` }}
                    className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
                    layout
                />
            </div>

            {/* Article Header */}
            <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer bg-[length:200%_100%]"></div>

                <div className="relative max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Back Button */}
                        <motion.button
                            onClick={() => navigate('/blog')}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm"
                            whileHover={{ x: -4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaArrowLeft size={14} />
                            <span className="text-sm font-medium">Back to Blog</span>
                        </motion.button>

                        {/* Category */}
                        <motion.span
                            className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full mb-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {post.category}
                        </motion.span>

                        {/* Title */}
                        <motion.h1
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {post.title}
                        </motion.h1>

                        {/* Excerpt */}
                        <motion.p
                            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {post.excerpt}
                        </motion.p>

                        {/* Metadata */}
                        <motion.div
                            className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center gap-2">
                                <FaCalendar size={14} />
                                <span>{new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock size={14} />
                                <span>{post.readTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaUser size={14} />
                                <span>Pubudu Tharanga</span>
                            </div>
                        </motion.div>

                        {/* Tags */}
                        {post.tags && (
                            <motion.div
                                className="flex flex-wrap gap-2 mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                                    >
                                        <FaTag size={10} />
                                        {tag}
                                    </span>
                                ))}
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <motion.button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-3 rounded-xl transition-colors duration-300 flex items-center gap-2 ${isBookmarked
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600'
                                    }`}
                                variants={bookmarkVariants}
                                initial="initial"
                                animate={isBookmarked ? "bookmarked" : "initial"}
                                whileTap="tapped"
                            >
                                <FaBookmark size={16} />
                                <span className="hidden sm:inline text-sm font-medium">
                                    {isBookmarked ? 'Saved' : 'Save'}
                                </span>
                            </motion.button>

                            {/* Share Button */}
                            <ShareButton />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Article Content */}
            <article className="py-12 md:py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <motion.div
                                id="post-content"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:dark:bg-blue-900/20 prose-blockquote:italic prose-blockquote:px-4 prose-blockquote:py-2"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Article Footer */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                            PT
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">Pubudu Tharanga</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">Full Stack Developer & Undergraduate</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ShareButton />
                                        <motion.button
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaArrowRight className="rotate-270" size={16} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="space-y-6 lg:sticky lg:top-24"
                            >
                                {/* Author Card */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            PT
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Pubudu Tharanga</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            Full Stack Developer & Undergraduate
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-500 text-xs leading-relaxed">
                                            Passionate about creating exceptional digital experiences and sharing knowledge with the community.
                                        </p>
                                    </div>
                                </div>

                                {/* Related Posts */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Related Articles</h4>
                                    <div className="space-y-4">
                                        {BLOG_POSTS
                                            .filter(p => p.id !== post.id && p.id !== parseInt(post.id))
                                            .slice(0, 3)
                                            .map(relatedPost => (
                                                <motion.div
                                                    key={relatedPost.id}
                                                    whileHover={{ x: 4 }}
                                                    transition={{ type: "spring", stiffness: 400 }}
                                                >
                                                    <Link
                                                        to={`/blog/${relatedPost.id}`}
                                                        className="block p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300 group"
                                                    >
                                                        <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                            {relatedPost.title}
                                                        </h5>
                                                        <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">
                                                            {relatedPost.excerpt}
                                                        </p>
                                                    </Link>
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}
