import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch,
    FaFilter,
    FaEdit,
    FaTrash,
    FaEye,
    FaLinkedin,
    FaCheck,
    FaExclamationTriangle,
    FaSpinner,
    FaChevronLeft,
    FaChevronRight,
    FaSyncAlt,
    FaTimes,
    FaFileAlt
} from 'react-icons/fa';

export default function BlogManagerTab({ onEditPost, onOpenLinkedInStudio }) {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, totalPublished: 0, totalDrafts: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModalPost, setDeleteModalPost] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState({ text: '', type: '' });

    // Fetch posts from API
    const fetchPosts = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: '10',
                status: statusFilter,
                category: categoryFilter,
                search: searchQuery
            });

            const res = await fetch(`/api/admin/posts?${params.toString()}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
                setPagination(data.pagination || { page, limit: 10, total: 0, totalPages: 1, totalPublished: 0, totalDrafts: 0 });
            }
        } catch (err) {
            console.error('Error fetching admin posts:', err);
            setNotification({ text: 'Failed to load posts from database', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, categoryFilter, searchQuery]);

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    // Handle Toggle Status (Draft <-> Published)
    const handleToggleStatus = async (post) => {
        const nextStatus = post.status === 'published' ? 'draft' : 'published';
        try {
            const res = await fetch('/api/admin/posts', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: post.id,
                    slug: post.slug,
                    status: nextStatus
                })
            });

            if (res.ok) {
                setNotification({
                    text: `Post status changed to ${nextStatus}!`,
                    type: 'success'
                });
                fetchPosts(pagination.page);
            }
        } catch (err) {
            setNotification({ text: 'Failed to update post status', type: 'error' });
        }
    };

    // Handle Delete Post
    const handleDeletePost = async (hard = false) => {
        if (!deleteModalPost) return;
        setIsDeleting(true);

        try {
            const queryParams = new URLSearchParams({
                id: deleteModalPost.id || deleteModalPost._id || '',
                slug: deleteModalPost.slug || '',
                hard: String(hard)
            }).toString();

            const res = await fetch(`/api/admin/posts?${queryParams}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                setNotification({ text: 'Post deleted successfully!', type: 'success' });
                setDeleteModalPost(null);
                fetchPosts(pagination.page);
            } else {
                const errData = await res.json().catch(() => ({}));
                setNotification({ text: errData.error || 'Failed to delete post', type: 'error' });
            }
        } catch (err) {
            setNotification({ text: 'Network error deleting post', type: 'error' });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Articles</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                        {pagination.total || 0}
                    </h3>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-900/40 rounded-3xl p-5 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Published Live</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {pagination.totalPublished || 0}
                    </h3>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/40 rounded-3xl p-5 shadow-sm col-span-2 sm:col-span-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Drafts</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                        {pagination.totalDrafts || 0}
                    </h3>
                </div>
            </div>

            {/* Notification Banner */}
            {notification.text && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-xs font-medium flex items-center justify-between gap-3 ${notification.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                        }`}
                >
                    <span>{notification.text}</span>
                    <button onClick={() => setNotification({ text: '', type: '' })}>
                        <FaTimes />
                    </button>
                </motion.div>
            )}

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search posts by title or tag..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Status Filter */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center text-xs">
                        {['all', 'published', 'draft'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${statusFilter === st ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => fetchPosts(pagination.page)}
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Refresh list"
                    >
                        <FaSyncAlt size={12} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
                                <th className="py-4 px-6">Article</th>
                                <th className="py-4 px-4">Category</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4">Date</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400">
                                        <FaSpinner className="animate-spin inline-block text-xl mb-2 text-blue-500" />
                                        <p>Loading articles from MongoDB...</p>
                                    </td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400">
                                        <FaFileAlt className="inline-block text-2xl mb-2 opacity-50" />
                                        <p>No articles found matching your query.</p>
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id || post.slug} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-8 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                                                    <img src={post.featured || '/blog1.webp'} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="max-w-xs sm:max-w-md truncate">
                                                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                                                        {post.title}
                                                    </h4>
                                                    <span className="text-[11px] text-gray-400 font-mono">
                                                        /blog/{post.slug}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">
                                                {post.category}
                                            </span>
                                        </td>

                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => handleToggleStatus(post)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${post.status === 'published'
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                                                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                                                    }`}
                                                title="Click to toggle status"
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                {post.status === 'published' ? 'Published' : 'Draft'}
                                            </button>
                                        </td>

                                        <td className="py-4 px-4 text-gray-400 text-xs">
                                            {post.date || 'N/A'}
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* View Live */}
                                                <a
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-500 hover:text-blue-600 transition-colors"
                                                    title="View live blog"
                                                >
                                                    <FaEye size={13} />
                                                </a>

                                                {/* LinkedIn Studio */}
                                                {onOpenLinkedInStudio && (
                                                    <button
                                                        onClick={() => onOpenLinkedInStudio(post)}
                                                        className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-500 hover:text-indigo-600 transition-colors"
                                                        title="Generate Sinhala LinkedIn Post"
                                                    >
                                                        <FaLinkedin size={13} />
                                                    </button>
                                                )}

                                                {/* Edit */}
                                                {onEditPost && (
                                                    <button
                                                        onClick={() => onEditPost(post)}
                                                        className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-500 hover:text-emerald-600 transition-colors"
                                                        title="Edit in Manual Studio"
                                                    >
                                                        <FaEdit size={13} />
                                                    </button>
                                                )}

                                                {/* Delete */}
                                                <button
                                                    onClick={() => setDeleteModalPost(post)}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-600 transition-colors"
                                                    title="Delete post"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls (Fixes H7) */}
                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                        <span>Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => fetchPosts(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <FaChevronLeft size={10} />
                            </button>
                            <button
                                onClick={() => fetchPosts(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <FaChevronRight size={10} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalPost && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                                <FaExclamationTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Delete Article & Media?
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Are you sure you want to delete <strong className="text-gray-900 dark:text-gray-200">"{deleteModalPost.title}"</strong>?
                                </p>
                                <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <FaCloudUploadAlt size={14} className="shrink-0" />
                                    <span>This will permanently delete the post from MongoDB and delete its cover thumbnail from Cloudinary CDN.</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4">
                                <button
                                    onClick={() => setDeleteModalPost(null)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeletePost(true)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5"
                                >
                                    {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                                    <span>Permanent Delete</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
