import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    FaFileAlt,
    FaCloudUploadAlt,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaCopy,
    FaGlobe,
    FaLayerGroup,
    FaCloud,
    FaEllipsisV
} from 'react-icons/fa';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '../../components/ui/Select';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '../../components/ui/DropdownMenu';

const CATEGORIES = [
    'All',
    'AI Automation',
    'AI Tools',
    'Cybersecurity',
    'Web Development',
    'Productivity',
    'IT Governance',
    'Quality Assurance',
    'Cloud & DevOps',
    'Industry Insights',
    'Tutorials',
    'Case Studies',
    'Tips & Resources'
];

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
    const [copiedSlug, setCopiedSlug] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    // Fetch posts from API
    const fetchPosts = useCallback(async (page = 1, retryCount = 0) => {
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
                // Clear any previous error notification on success
                if (notification.type === 'error') {
                    setNotification({ text: '', type: '' });
                }
            } else {
                // Server returned an error — auto-retry once after 2s
                const errData = await res.json().catch(() => ({}));
                const errMsg = errData.error || `Server responded with ${res.status}`;
                console.warn('Admin posts fetch failed:', errMsg);

                if (retryCount < 1) {
                    setNotification({ text: `Database slow — retrying...`, type: 'warning' });
                    setTimeout(() => fetchPosts(page, retryCount + 1), 2000);
                    return; // Don't clear isLoading yet
                } else {
                    setNotification({ text: `Database connection failed: ${errMsg}. Click refresh to retry.`, type: 'error' });
                }
            }
        } catch (err) {
            console.error('Error fetching admin posts:', err);
            // Network error — auto-retry once
            if (retryCount < 1) {
                setNotification({ text: `Network issue — retrying...`, type: 'warning' });
                setTimeout(() => fetchPosts(page, retryCount + 1), 2000);
                return;
            } else {
                setNotification({ text: 'Failed to connect to database. Check your network and click refresh.', type: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, categoryFilter, searchQuery]);

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    // Client-side sorting for current page
    const sortedPosts = useMemo(() => {
        const items = [...posts];
        if (!sortConfig.key) return items;

        return items.sort((a, b) => {
            let aVal = a[sortConfig.key] || '';
            let bVal = b[sortConfig.key] || '';

            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [posts, sortConfig]);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Copy link helper
    const handleCopyPostLink = (slug) => {
        const fullUrl = `${window.location.origin}/blog/${slug}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(''), 2000);
    };

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
                const data = await res.json().catch(() => ({}));
                const msg = data.cloudinarySummary?.total > 0
                    ? `Post deleted! ${data.cloudinarySummary.succeeded}/${data.cloudinarySummary.total} Cloudinary asset(s) cleaned up.`
                    : 'Post deleted successfully!';
                const type = data.cloudinarySummary?.failed > 0 ? 'warning' : 'success';
                setNotification({ text: msg, type });
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

    const publishedRatio = pagination.total > 0
        ? Math.round(((pagination.totalPublished || 0) / pagination.total) * 100)
        : 100;

    return (
        <div className="space-y-6">
            {/* Top Metric Cards (Executive KPI Grid) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Articles */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Total Articles
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <FaLayerGroup size={15} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                            {pagination.total || 0}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1 font-medium">All database documents</p>
                    </div>
                </div>

                {/* Published Live */}
                <div className="bg-white dark:bg-gray-900 border border-emerald-200/80 dark:border-emerald-900/40 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Published Live
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <FaGlobe size={15} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                                {pagination.totalPublished || 0}
                            </h3>
                            <span className="text-xs font-bold text-emerald-500/80 font-mono">
                                ({publishedRatio}%)
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 font-medium">Indexed & publicly live</p>
                    </div>
                </div>

                {/* Drafts */}
                <div className="bg-white dark:bg-gray-900 border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Drafts in Progress
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <FaEdit size={15} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                            {pagination.totalDrafts || 0}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1 font-medium">Hidden from search & blog</p>
                    </div>
                </div>

                {/* Cloudinary CDN Media */}
                <div className="bg-white dark:bg-gray-900 border border-sky-200/80 dark:border-sky-900/40 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                            CDN Media Assets
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                            <FaCloud size={15} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 tracking-tight">
                            {pagination.total || 0}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1 font-medium">Synced with Cloudinary</p>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {notification.text && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-xs ${
                        notification.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            : notification.type === 'warning'
                                ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                                : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                    }`}
                >
                    <span>{notification.text}</span>
                    <button onClick={() => setNotification({ text: '', type: '' })}>
                        <FaTimes />
                    </button>
                </motion.div>
            )}

            {/* Filter & Search Bar Command Center */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-80">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles by title or tag..."
                            className="w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={10} />
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="w-full sm:w-52">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="py-2 rounded-xl text-xs font-medium">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(c => (
                                    <SelectItem key={c} value={c}>
                                        {c === 'All' ? 'All Categories' : c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Status Segmented Control & Refresh */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center text-xs">
                        {['all', 'published', 'draft'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1 rounded-lg capitalize font-bold transition-all text-[11px] ${
                                    statusFilter === st
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => fetchPosts(pagination.page)}
                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0 shadow-xs"
                        title="Refresh articles"
                    >
                        <FaSyncAlt size={12} className={isLoading ? 'animate-spin text-blue-500' : ''} />
                    </button>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-[11px] font-extrabold uppercase tracking-wider select-none">
                                <th
                                    className="py-4 px-6 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                                    onClick={() => handleSort('title')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span>Article</span>
                                        {sortConfig.key === 'title' ? (
                                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                        ) : (
                                            <FaSort className="opacity-30" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="py-4 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                                    onClick={() => handleSort('category')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span>Category</span>
                                        {sortConfig.key === 'category' ? (
                                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                        ) : (
                                            <FaSort className="opacity-30" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="py-4 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span>Status</span>
                                        {sortConfig.key === 'status' ? (
                                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                        ) : (
                                            <FaSort className="opacity-30" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="py-4 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span>Date</span>
                                        {sortConfig.key === 'date' ? (
                                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                        ) : (
                                            <FaSort className="opacity-30" />
                                        )}
                                    </div>
                                </th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-14 text-center text-gray-400">
                                        <FaSpinner className="animate-spin inline-block text-2xl mb-2 text-blue-500" />
                                        <p className="font-semibold text-xs">Querying MongoDB Atlas...</p>
                                    </td>
                                </tr>
                            ) : sortedPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-14 text-center text-gray-400">
                                        <FaFileAlt className="inline-block text-3xl mb-2 opacity-40" />
                                        <p className="font-semibold text-xs">No articles found matching filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                sortedPosts.map((post) => (
                                    <tr
                                        key={post.id || post.slug}
                                        className="hover:bg-blue-50/40 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        {/* Article Details */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3.5">
                                                <div className="relative w-14 h-9 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 border border-gray-200/80 dark:border-gray-700 shadow-xs">
                                                    <img
                                                        src={post.featured || '/blog1.webp'}
                                                        alt=""
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="max-w-xs sm:max-w-md truncate">
                                                    <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyPostLink(post.slug)}
                                                            className="text-[11px] text-gray-400 font-mono hover:text-blue-500 transition-colors flex items-center gap-1"
                                                            title="Click to copy link"
                                                        >
                                                            <span>/blog/{post.slug}</span>
                                                            {copiedSlug === post.slug ? (
                                                                <FaCheck size={9} className="text-emerald-500" />
                                                            ) : (
                                                                <FaCopy size={9} className="opacity-50" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category Badge */}
                                        <td className="py-4 px-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-bold border border-gray-200/60 dark:border-gray-700/60">
                                                {post.category || 'General'}
                                            </span>
                                        </td>

                                        {/* Status Toggle Button */}
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => handleToggleStatus(post)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border transition-all hover:scale-105 active:scale-95 ${
                                                    post.status === 'published'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 shadow-xs'
                                                        : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                                                }`}
                                                title="Click to toggle status"
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                                <span>{post.status === 'published' ? 'Published' : 'Draft'}</span>
                                            </button>
                                        </td>

                                        {/* Date */}
                                        <td className="py-4 px-4 text-gray-500 dark:text-gray-400 text-xs font-mono">
                                            {post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A')}
                                        </td>

                                        {/* Action Cluster with Radix DropdownMenu */}
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Quick View Live */}
                                                <a
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="View live blog post"
                                                >
                                                    <FaEye size={13} />
                                                </a>

                                                {/* Quick Edit */}
                                                {onEditPost && (
                                                    <button
                                                        onClick={() => onEditPost(post)}
                                                        className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-400 hover:text-emerald-600 transition-colors"
                                                        title="Edit in Manual Studio"
                                                    >
                                                        <FaEdit size={13} />
                                                    </button>
                                                )}

                                                {/* Radix UI Context Dropdown Menu */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                            title="More Actions"
                                                        >
                                                            <FaEllipsisV size={13} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-52">
                                                        <DropdownMenuLabel>Article Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                const url = `${window.location.origin}/blog/${post.slug}`;
                                                                navigator.clipboard.writeText(url);
                                                                setNotification({ text: 'Article URL copied to clipboard!', type: 'success' });
                                                            }}
                                                        >
                                                            <FaCopy size={11} className="text-gray-400" />
                                                            <span>Copy Public URL</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a
                                                                href={`/blog/${post.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <FaEye size={11} className="text-blue-500" />
                                                                <span>View Live Post ↗</span>
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleStatus(post)}>
                                                            <FaGlobe size={11} className="text-emerald-500" />
                                                            <span>
                                                                Set to {post.status === 'published' ? 'Draft' : 'Published'}
                                                            </span>
                                                        </DropdownMenuItem>
                                                        {onOpenLinkedInStudio && (
                                                            <DropdownMenuItem onClick={() => onOpenLinkedInStudio(post)}>
                                                                <FaLinkedin size={11} className="text-[#0A66C2]" />
                                                                <span>Generate LinkedIn Post</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {onEditPost && (
                                                            <DropdownMenuItem onClick={() => onEditPost(post)}>
                                                                <FaEdit size={11} className="text-indigo-500" />
                                                                <span>Edit in Studio</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            destructive
                                                            onClick={() => setDeleteModalPost(post)}
                                                        >
                                                            <FaTrash size={11} />
                                                            <span>Delete Post & Media</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 font-medium bg-gray-50/40 dark:bg-gray-800/20">
                        <span>Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => fetchPosts(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <FaChevronLeft size={10} />
                            </button>
                            <button
                                onClick={() => fetchPosts(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <FaChevronRight size={10} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Hardened Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalPost && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                                <FaExclamationTriangle size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Delete Article & Cloudinary CDN Media?
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                                    Are you sure you want to delete <strong className="text-gray-900 dark:text-gray-200">"{deleteModalPost.title}"</strong>?
                                </p>
                                <div className="mt-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-[11px] text-red-700 dark:text-red-400 flex items-start gap-2.5">
                                    <FaCloudUploadAlt size={16} className="shrink-0 mt-0.5" />
                                    <span className="leading-snug">
                                        This permanently purges the document from MongoDB Atlas and removes its linked thumbnail and images from Cloudinary CDN.
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3">
                                <button
                                    onClick={() => setDeleteModalPost(null)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeletePost(true)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-500/20 transition-all disabled:opacity-50"
                                >
                                    {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash size={11} />}
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
