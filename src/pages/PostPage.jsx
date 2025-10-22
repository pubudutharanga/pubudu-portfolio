import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { BLOG_POSTS } from '../data'
import { FaCalendar, FaClock, FaArrowLeft, FaShare, FaUser, FaTag, FaBookmark } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function PostPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const post = BLOG_POSTS.find(p => p.id === id)
    const [progress, setProgress] = useState(0)
    const [isBookmarked, setIsBookmarked] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            const el = document.getElementById('post-content')
            if (!el) return
            const total = el.scrollHeight - el.clientHeight
            const scrolled = window.scrollY - el.offsetTop + 100
            const pct = Math.max(0, Math.min(100, (scrolled / total) * 100))
            setProgress(isFinite(pct) ? pct : 0)
        }
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (!post) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h2>
                    <Link to="/blog" className="text-blue-600 hover:text-blue-700">
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
                <div
                    style={{ width: `${progress}%` }}
                    className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
                />
            </div>

            {/* Article Header */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer bg-[length:200%_100%]"></div>

                <div className="relative max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/blog')}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                        >
                            <FaArrowLeft size={14} />
                            Back to Blog
                        </button>

                        {/* Category */}
                        <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full mb-6">
              {post.category}
            </span>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            {post.excerpt}
                        </p>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-8">
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
                        </div>

                        {/* Tags */}
                        {post.tags && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                                    >
                    <FaTag size={10} />
                                        {tag}
                  </span>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-3 rounded-xl transition-colors duration-300 ${
                                    isBookmarked
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600'
                                }`}
                            >
                                <FaBookmark size={16} />
                            </button>
                            <button className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300">
                                <FaShare size={16} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Article Content */}
            <article className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <motion.div
                                id="post-content"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="prose prose-lg dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="space-y-6"
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
                                        <p className="text-gray-500 dark:text-gray-500 text-xs">
                                            Passionate about creating exceptional digital experiences and sharing knowledge with the community.
                                        </p>
                                    </div>
                                </div>

                                {/* Related Posts */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Related Articles</h4>
                                    <div className="space-y-4">
                                        {BLOG_POSTS
                                            .filter(p => p.id !== post.id)
                                            .slice(0, 3)
                                            .map(relatedPost => (
                                                <Link
                                                    key={relatedPost.id}
                                                    to={`/blog/${relatedPost.id}`}
                                                    className="block p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300"
                                                >
                                                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                                                        {relatedPost.title}
                                                    </h5>
                                                    <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">
                                                        {relatedPost.excerpt}
                                                    </p>
                                                </Link>
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
