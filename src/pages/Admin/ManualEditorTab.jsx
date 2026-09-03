import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    FaEdit,
    FaEye,
    FaSave,
    FaRocket,
    FaImage,
    FaCode,
    FaQuoteLeft,
    FaLightbulb,
    FaThLarge,
    FaSpinner,
    FaCheck,
    FaTimes,
    FaCloudUploadAlt,
    FaSun,
    FaMoon,
    FaDesktop,
    FaTabletAlt,
    FaMobileAlt,
    FaBold,
    FaItalic,
    FaHeading,
    FaUndo,
    FaFolder,
    FaLink,
    FaClock,
    FaTag
} from 'react-icons/fa';
import { uploadDirectToCloudinary } from '../../utils/cloudinaryDirectUpload';
import { useAutosaveDraft } from '../../hooks/useAutosaveDraft';
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

export default function ManualEditorTab({ initialPostData = null, onPostSaved, onClearEditPost }) {
    const { getStoredDraft, saveDraft, clearDraft, lastSaved } = useAutosaveDraft();

    // Form fields
    const [id, setId] = useState(initialPostData?.id || '');
    const [title, setTitle] = useState(initialPostData?.title || '');
    const [slug, setSlug] = useState(initialPostData?.slug || '');
    const [category, setCategory] = useState(initialPostData?.category || CATEGORIES[0]);
    const [excerpt, setExcerpt] = useState(initialPostData?.excerpt || '');
    const [readTime, setReadTime] = useState(initialPostData?.readTime || '5 min read');
    const [featuredUrl, setFeaturedUrl] = useState(initialPostData?.featured || '');
    const [featuredAlt, setFeaturedAlt] = useState(initialPostData?.featuredAlt || initialPostData?.title || '');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState(initialPostData?.tags || ['Web Development', 'React']);
    const [contentHtml, setContentHtml] = useState(initialPostData?.content || '<p class="lead dark:text-gray-300">Write your article introduction here...</p>\n\n<h2 class="dark:text-white">Getting Started</h2>\n<p class="dark:text-gray-300">Detailed explanation goes here.</p>');
    const [status, setStatus] = useState(initialPostData?.status || 'published');

    // UI state
    const [previewThemeDark, setPreviewThemeDark] = useState(true);
    const [activeViewMode, setActiveViewMode] = useState('split'); // 'split', 'editor', 'preview'
    const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const editorTextareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const inlineImageInputRef = useRef(null);

    // Auto-generate slug from title if not editing an existing post
    const handleTitleChange = (newTitle) => {
        setTitle(newTitle);
        if (!initialPostData && !id) {
            const autoSlug = newTitle
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-');
            setSlug(autoSlug);
        }
    };

    // Calculate dynamic reading time & words
    const calculateAnalytics = () => {
        const textOnly = contentHtml.replace(/<[^>]*>/g, ' ');
        const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
        const chars = textOnly.length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        const headingMatches = contentHtml.match(/<h[2-4][^>]*>/gi) || [];
        return { words, chars, readTimeEst: `${minutes} min read`, headingCount: headingMatches.length };
    };

    const analytics = calculateAnalytics();

    // Populate when initialPostData changes
    useEffect(() => {
        if (initialPostData) {
            setId(initialPostData.id || '');
            setTitle(initialPostData.title || '');
            setSlug(initialPostData.slug || '');
            setCategory(initialPostData.category || CATEGORIES[0]);
            setExcerpt(initialPostData.excerpt || '');
            setReadTime(initialPostData.readTime || '5 min read');
            setFeaturedUrl(initialPostData.featured || '');
            setFeaturedAlt(initialPostData.featuredAlt || initialPostData.title || '');
            setTags(initialPostData.tags || []);
            setContentHtml(initialPostData.content || '');
            setStatus(initialPostData.status || 'published');
        } else {
            setId('');
            setTitle('');
            setSlug('');
            setCategory(CATEGORIES[0]);
            setExcerpt('');
            setReadTime('5 min read');
            setFeaturedUrl('');
            setFeaturedAlt('');
            setTags(['Web Development', 'React']);
            setContentHtml('<p class="lead dark:text-gray-300">Write your article introduction here...</p>\n\n<h2 class="dark:text-white">Getting Started</h2>\n<p class="dark:text-gray-300">Detailed explanation goes here.</p>');
            setStatus('published');
        }
    }, [initialPostData]);

    // Autosave draft on content changes (only if creating a new post)
    useEffect(() => {
        if (!initialPostData) {
            saveDraft({
                title,
                slug,
                category,
                excerpt,
                readTime,
                featuredUrl,
                featuredAlt,
                tags,
                contentHtml,
                status
            });
        }
    }, [title, slug, category, excerpt, readTime, featuredUrl, featuredAlt, tags, contentHtml, status, initialPostData, saveDraft]);

    // Restore draft from localStorage
    const handleRestoreDraft = () => {
        const saved = getStoredDraft();
        if (saved) {
            setTitle(saved.title || '');
            setSlug(saved.slug || '');
            setCategory(saved.category || CATEGORIES[0]);
            setExcerpt(saved.excerpt || '');
            setReadTime(saved.readTime || '5 min read');
            setFeaturedUrl(saved.featuredUrl || '');
            setFeaturedAlt(saved.featuredAlt || '');
            setTags(saved.tags || []);
            setContentHtml(saved.contentHtml || '');
            setStatus(saved.status || 'draft');
            setMessage({ text: 'Draft restored from your last session!', type: 'success' });
        }
    };

    // Add Tag
    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const clean = tagInput.trim().replace(/^#/, '');
            if (clean && !tags.includes(clean)) {
                setTags([...tags, clean]);
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    // Insert HTML template at cursor position
    const insertSnippet = (snippet) => {
        const textarea = editorTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = contentHtml;
        const before = text.substring(0, start);
        const after = text.substring(end);

        const newContent = before + snippet + after;
        setContentHtml(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + snippet.length, start + snippet.length);
        }, 50);
    };

    // Handle Featured Image Upload
    const handleFeaturedUpload = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            setMessage({ text: 'Please select a valid image file.', type: 'error' });
            return;
        }

        setIsUploadingImage(true);
        setUploadPercent(0);
        setMessage({ text: '', type: '' });

        try {
            const result = await uploadDirectToCloudinary(file, 'portfolio/blogs', (p) => setUploadPercent(p));
            setFeaturedUrl(result.secure_url);
            if (!featuredAlt) setFeaturedAlt(title || 'Blog featured cover image');
            setMessage({ text: 'Featured image uploaded to Cloudinary CDN!', type: 'success' });
        } catch (err) {
            setMessage({ text: err.message || 'Image upload failed', type: 'error' });
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Handle Inline Image Upload
    const handleInlineImageUpload = async (file) => {
        if (!file) return;
        setIsUploadingImage(true);
        setMessage({ text: 'Uploading inline article image...', type: 'info' });

        try {
            const result = await uploadDirectToCloudinary(file, 'portfolio/blogs');
            const imgSnippet = `\n<figure class="my-6">\n  <img src="${result.secure_url}" alt="Article demonstration" class="w-full rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800" loading="lazy" />\n  <figcaption class="text-center text-xs text-gray-500 mt-2">Demonstration figure</figcaption>\n</figure>\n`;
            insertSnippet(imgSnippet);
            setMessage({ text: 'Inline image inserted into article!', type: 'success' });
        } catch (err) {
            setMessage({ text: err.message || 'Failed to upload inline image', type: 'error' });
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Submit / Save Post to MongoDB
    const handleSavePost = async (targetStatus) => {
        if (!title.trim()) {
            setMessage({ text: 'Article title is required.', type: 'error' });
            return;
        }
        if (!slug.trim()) {
            setMessage({ text: 'URL slug is required.', type: 'error' });
            return;
        }
        if (!contentHtml.trim()) {
            setMessage({ text: 'Article content cannot be empty.', type: 'error' });
            return;
        }

        setIsSaving(true);
        setMessage({ text: '', type: '' });

        const payload = {
            id: id || undefined,
            title: title.trim(),
            slug: slug.trim(),
            category,
            excerpt: excerpt.trim(),
            readTime: readTime || analytics.readTimeEst,
            featured: featuredUrl || '/blog1.webp',
            tags,
            content: contentHtml,
            status: targetStatus || status,
            source: 'manual',
            author: {
                name: 'Pubudu Tharanga',
                avatarLight: '/PT_light.jpg',
                avatarDark: '/PT.jpg'
            },
            seo: {
                metaDescription: excerpt,
                ogImage: featuredUrl
            }
        };

        try {
            const isEditing = Boolean(id || initialPostData);
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch('/api/admin/posts', {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to save blog post');
            }

            clearDraft();
            setMessage({
                text: isEditing ? 'Post updated successfully!' : `Post created and ${targetStatus === 'published' ? 'published live' : 'saved as draft'}!`,
                type: 'success'
            });

            if (onPostSaved) {
                onPostSaved(data.post);
            }
        } catch (err) {
            setMessage({ text: err.message || 'Error saving post', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Studio Command Bar */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <FaEdit size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
                                {id ? `Editing: ${title || slug}` : 'Manual Blog Studio (Split-Pane)'}
                            </h2>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                id
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800'
                            }`}>
                                {id ? 'Update Mode' : 'New Article'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Full HTML/Markdown control with responsive live preview and Cloudinary asset management.
                        </p>
                    </div>
                </div>

                {/* Top Action Controls */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    {/* View Mode Switcher */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl flex items-center gap-1 text-xs">
                        <button
                            type="button"
                            onClick={() => setActiveViewMode('split')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                                activeViewMode === 'split'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            Split Pane
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveViewMode('editor')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                                activeViewMode === 'editor'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            Editor Only
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveViewMode('preview')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                                activeViewMode === 'preview'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            Preview Only
                        </button>
                    </div>

                    {id && onClearEditPost && (
                        <button
                            type="button"
                            onClick={onClearEditPost}
                            className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                        >
                            + New Post
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => handleSavePost('draft')}
                        disabled={isSaving}
                        className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-all flex items-center gap-1.5 shadow-xs"
                    >
                        <FaSave />
                        <span>Save Draft</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSavePost('published')}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isSaving ? <FaSpinner className="animate-spin" /> : <FaRocket />}
                        <span>{id ? 'Update Live' : 'Publish Live'}</span>
                    </button>
                </div>
            </div>

            {/* Notification Toast */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-xs ${
                        message.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                    }`}
                >
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ text: '', type: '' })}>
                        <FaTimes />
                    </button>
                </motion.div>
            )}

            {/* Autosave Draft Notification Banner */}
            {!id && lastSaved && (
                <div className="px-4 py-2.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <FaCheck className="text-blue-500" size={11} />
                        <span>Autosaved draft available from {new Date(lastSaved).toLocaleTimeString()}</span>
                    </span>
                    <button
                        type="button"
                        onClick={handleRestoreDraft}
                        className="font-bold underline hover:text-blue-900 dark:hover:text-blue-100 ml-2"
                    >
                        Restore Draft
                    </button>
                </div>
            )}

            {/* Article Metadata & CDN Asset Configuration */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <FaFolder size={11} className="text-blue-500" />
                        <span>Metadata, Categories & CDN Media</span>
                    </h3>
                    <span className="text-[11px] text-gray-400 font-mono">
                        {analytics.words} words • {analytics.readTimeEst}
                    </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                            Article Title <span className="text-blue-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter post title"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                            Category
                        </label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1">
                            <FaLink size={10} className="text-gray-400" />
                            <span>URL Slug</span>
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="url-friendly-slug"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Read Time */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1">
                            <FaClock size={10} className="text-gray-400" />
                            <span>Read Time</span>
                        </label>
                        <input
                            type="text"
                            value={readTime}
                            onChange={(e) => setReadTime(e.target.value)}
                            placeholder="e.g. 5 min read"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Featured Image URL & Direct CDN Upload */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                            Cover Image (Cloudinary)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={featuredUrl}
                                onChange={(e) => setFeaturedUrl(e.target.value)}
                                placeholder="https://res.cloudinary.com/..."
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFeaturedUpload(e.target.files?.[0])}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingImage}
                                className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold shrink-0 transition-colors flex items-center gap-1 shadow-xs"
                            >
                                {isUploadingImage ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                                <span>Upload</span>
                            </button>
                        </div>
                    </div>

                    {/* Excerpt Hook */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                            Excerpt Hook (120-250 characters)
                        </label>
                        <input
                            type="text"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Catchy 2-sentence summary of the article"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Tags Chip Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1">
                            <FaTag size={10} className="text-gray-400" />
                            <span>Tags (Press Enter)</span>
                        </label>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Add tag & press Enter"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-bold"
                                >
                                    #{tag}
                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                                        <FaTimes size={9} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Split-Pane: Editor (Left) & Responsive Live Preview (Right) */}
            <div className={`grid gap-6 ${activeViewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                {/* LEFT PANE: Editor with Formatting Command Bar */}
                {(activeViewMode === 'split' || activeViewMode === 'editor') && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col space-y-3.5">
                        {/* Snippet Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                <FaCode size={11} className="text-blue-500" />
                                <span>HTML Editor</span>
                            </span>

                            {/* Rich Snippet Buttons with Radix DropdownMenu */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold transition-all flex items-center gap-1.5 border border-blue-200 dark:border-blue-800/80 shadow-2xs"
                                        >
                                            <FaLightbulb size={11} />
                                            <span>Insert Component ▾</span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>Typography</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => insertSnippet('\n<h2 class="dark:text-white font-bold text-2xl mt-8 mb-4">Section Heading</h2>\n')}>
                                            <FaHeading size={11} className="text-blue-500" />
                                            <span>Heading 2 (H2)</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => insertSnippet('\n<h3 class="dark:text-white font-bold text-xl mt-6 mb-3">Sub-section Heading</h3>\n')}>
                                            <FaHeading size={9} className="text-indigo-500" />
                                            <span>Heading 3 (H3)</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => insertSnippet('\n<p class="lead text-lg text-gray-700 dark:text-gray-300 font-medium my-4">Key introduction or executive summary text...</p>\n')}>
                                            <FaQuoteLeft size={10} className="text-purple-500" />
                                            <span>Lead Paragraph</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Containers & Callouts</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => insertSnippet('\n<div class="highlight-box dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200 p-4 rounded-xl border my-6">\n  <p><strong>Key Insight:</strong> Add your critical takeaway here.</p>\n</div>\n')}>
                                            <FaLightbulb size={11} className="text-amber-500" />
                                            <span>Highlight Callout Box</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => insertSnippet('\n<div class="grid md:grid-cols-2 gap-4 my-6">\n  <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">\n    <h4 class="font-bold text-gray-900 dark:text-white">Feature 1</h4>\n    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Description 1</p>\n  </div>\n  <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">\n    <h4 class="font-bold text-gray-900 dark:text-white">Feature 2</h4>\n    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Description 2</p>\n  </div>\n</div>\n')}>
                                            <FaThLarge size={11} className="text-emerald-500" />
                                            <span>2-Col Feature Grid</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => insertSnippet('\n<blockquote class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 italic px-4 py-2.5 my-6 rounded-r-xl">\n  "Great engineering is about continuous simplification."\n</blockquote>\n')}>
                                            <FaQuoteLeft size={10} className="text-sky-500" />
                                            <span>Blockquote</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Code & Media</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => insertSnippet('\n<pre class="dark:bg-gray-800 dark:text-gray-200 p-4 rounded-xl overflow-x-auto my-6 border border-gray-200 dark:border-gray-700"><code class="language-javascript">// Code snippet here\nconst example = async () => {\n  console.log("Hello World");\n};</code></pre>\n')}>
                                            <FaCode size={11} className="text-violet-500" />
                                            <span>JavaScript Code Block</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => inlineImageInputRef.current?.click()}>
                                            <FaImage size={11} className="text-rose-500" />
                                            <span>Upload Cloudinary Image</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Quick Direct Inline Image */}
                                <input
                                    type="file"
                                    ref={inlineImageInputRef}
                                    onChange={(e) => handleInlineImageUpload(e.target.files?.[0])}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => inlineImageInputRef.current?.click()}
                                    className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold transition-colors flex items-center gap-1"
                                    title="Upload Inline Cloudinary Image"
                                >
                                    <FaImage size={10} /> Image
                                </button>
                            </div>
                        </div>

                        {/* Editor Textarea */}
                        <textarea
                            ref={editorTextareaRef}
                            value={contentHtml}
                            onChange={(e) => setContentHtml(e.target.value)}
                            placeholder="Write your article HTML here..."
                            rows={26}
                            className="w-full flex-1 bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-xs font-mono text-gray-900 dark:text-gray-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y shadow-inner"
                        />

                        {/* Real-Time Word & Headings Status Bar */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800 font-mono">
                            <div className="flex items-center gap-3">
                                <span>{analytics.words} words</span>
                                <span>•</span>
                                <span>{analytics.chars} characters</span>
                                <span>•</span>
                                <span>{analytics.headingCount} headings</span>
                            </div>
                            <span className="text-blue-500 font-semibold">{analytics.readTimeEst}</span>
                        </div>
                    </div>
                )}

                {/* RIGHT PANE: Device Emulation & Live Responsive Preview */}
                {(activeViewMode === 'split' || activeViewMode === 'preview') && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col space-y-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                            {/* Device Frame Emulators */}
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice('desktop')}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        previewDevice === 'desktop'
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    title="Desktop View (100%)"
                                >
                                    <FaDesktop size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice('tablet')}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        previewDevice === 'tablet'
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    title="Tablet View (768px)"
                                >
                                    <FaTabletAlt size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice('mobile')}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        previewDevice === 'mobile'
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    title="Mobile View (390px)"
                                >
                                    <FaMobileAlt size={13} />
                                </button>
                            </div>

                            {/* Theme Toggle for Preview Container */}
                            <button
                                type="button"
                                onClick={() => setPreviewThemeDark(!previewThemeDark)}
                                className="py-1 px-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                                {previewThemeDark ? <FaSun className="text-amber-500" size={11} /> : <FaMoon className="text-indigo-400" size={11} />}
                                <span>{previewThemeDark ? 'Light Preview' : 'Dark Preview'}</span>
                            </button>
                        </div>

                        {/* Device Frame Wrapper */}
                        <div className="flex-1 overflow-x-auto flex justify-center items-start">
                            <div className={`w-full transition-all duration-300 ${
                                previewDevice === 'mobile'
                                    ? 'max-w-[390px] border-4 border-gray-300 dark:border-gray-700 rounded-[36px] shadow-2xl p-4'
                                    : previewDevice === 'tablet'
                                        ? 'max-w-[768px] border-2 border-gray-300 dark:border-gray-700 rounded-3xl shadow-xl p-5'
                                        : 'max-w-full'
                            }`}>
                                <div className={`rounded-2xl p-6 overflow-y-auto max-h-[720px] border transition-colors ${
                                    previewThemeDark
                                        ? 'preview-scope-dark border-gray-800 shadow-inner'
                                        : 'preview-scope-light border-gray-200 shadow-sm'
                                }`}>
                                    {/* Preview Article Header */}
                                    {featuredUrl && (
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 shadow-md bg-gray-100 dark:bg-gray-800">
                                            <img src={featuredUrl} alt={featuredAlt || title} className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${previewThemeDark ? 'text-sky-400' : 'text-blue-600'}`}>
                                        {category} • {readTime || analytics.readTimeEst}
                                    </span>
                                    <h1 className="text-xl sm:text-2xl font-black mt-2 mb-3 tracking-tight">
                                        {title || 'Untitled Article'}
                                    </h1>

                                    {excerpt && (
                                        <p className={`text-xs font-medium mb-6 italic ${previewThemeDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {excerpt}
                                        </p>
                                    )}

                                    {/* Main Rendered HTML Body */}
                                    <div
                                        className="blog-content prose max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-img:rounded-xl leading-relaxed text-xs"
                                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
