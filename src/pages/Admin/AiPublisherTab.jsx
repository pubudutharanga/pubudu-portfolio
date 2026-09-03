import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaRobot,
    FaCloudUploadAlt,
    FaImage,
    FaCheck,
    FaSpinner,
    FaExternalLinkAlt,
    FaEdit,
    FaPlus,
    FaTimes,
    FaClock,
    FaFolder,
    FaUserGraduate,
    FaLinkedin,
    FaMagic,
    FaLightbulb,
    FaCopy,
    FaFileAlt,
    FaTerminal
} from 'react-icons/fa';
import { uploadDirectToCloudinary } from '../../utils/cloudinaryDirectUpload';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '../../components/ui/Select';

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

const AUDIENCE_LEVELS = [
    { label: 'Beginner to Intermediate', detail: 'Conceptual, Engaging, Real-World Examples • 8 min read' },
    { label: 'Mid-Level Software Engineer', detail: 'Practical Implementation, Code Patterns, Best Practices • 10 min read' },
    { label: 'Senior / Full Stack Developer', detail: 'Deep Architecture, Edge Cases & Performance • 12 min read' },
    { label: 'Tech Lead & Solutions Architect', detail: 'System Design, Tradeoffs & Enterprise Scaling • 15 min read' }
];

const INSPIRATION_PROMPTS = [
    'Agentic AI Workflows: Orchestrating Multi-Model Autonomous Agents in 2026',
    'Next.js 15 Server Actions: High-Performance Enterprise Architecture',
    'Why WebAssembly & Rust Are Reshaping Cloud Microservices in 2026',
    'Building Resilient Event-Driven Architectures with Kafka and Redis Streams'
];

export default function AiPublisherTab({ onEditPostInManualTab, onOpenLinkedInStudio, onPostPublished }) {
    // Form state
    const [topic, setTopic] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [audience, setAudience] = useState(AUDIENCE_LEVELS[0].label);
    const [customNotes, setCustomNotes] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [statusOption, setStatusOption] = useState('published'); // 'published' or 'draft'

    // Drag-and-drop state
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Generation state
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [stepLogs, setStepLogs] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [copiedSlug, setCopiedSlug] = useState(false);

    // Result state (Initialized directly from localStorage)
    const [generatedPost, setGeneratedPost] = useState(() => {
        try {
            const saved = localStorage.getItem('last_ai_generated_post');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // 'preview' shows the English blog preview; 'create' shows the form
    const [viewMode, setViewMode] = useState(() => {
        const hasSaved = typeof window !== 'undefined' && localStorage.getItem('last_ai_generated_post');
        return hasSaved ? 'preview' : 'create';
    });

    // Streamlined 3-step publishing pipeline
    const STEPS = [
        { label: 'Upload Thumbnail to Cloudinary CDN', desc: 'Secure signed direct CDN upload' },
        { label: 'Synthesize Article with Gemini AI 2.0', desc: 'Deep technical content & structure' },
        { label: 'Sanitize & Index into Atlas DB', desc: 'XSS protection & live publishing' }
    ];

    const handleFileSelect = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
            return;
        }
        setErrorMessage('');
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setThumbnailPreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleGenerateAndPublish = async (e) => {
        e.preventDefault();
        if (!topic.trim()) {
            setErrorMessage('Please provide a topic or select one of the inspiration prompts.');
            return;
        }
        if (!thumbnailFile) {
            setErrorMessage('Please upload a cover thumbnail image for the article.');
            return;
        }

        setIsGenerating(true);
        setErrorMessage('');
        setStepLogs([]);

        let uploadedImageUrl = null;
        let aiBlogData = null;

        try {
            // STEP 1: Direct upload thumbnail to Cloudinary CDN
            setCurrentStep(0);
            setStepLogs(prev => [...prev, '⚡ Connecting to Cloudinary signature issuer...']);
            
            const uploadResult = await uploadDirectToCloudinary(
                thumbnailFile,
                'portfolio/blogs',
                (percent) => setUploadProgress(percent)
            );

            uploadedImageUrl = uploadResult.secure_url;
            setStepLogs(prev => [...prev, `✓ Cover asset published to CDN: ${uploadedImageUrl}`]);

            // STEP 2: Call Gemini AI for English Blog Content
            setCurrentStep(1);
            setStepLogs(prev => [...prev, `⚡ Prompting Gemini AI 2.0 with "${topic}" [Category: ${category}]...`]);

            const blogGenRes = await fetch('/api/admin/generate', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'blog',
                    topic,
                    category,
                    audience,
                    customNotes
                })
            });

            if (!blogGenRes.ok) {
                const errJson = await blogGenRes.json().catch(() => ({}));
                throw new Error(errJson.error || 'Failed to generate blog content with Gemini');
            }

            const blogGenData = await blogGenRes.json();
            aiBlogData = blogGenData.data;
            setStepLogs(prev => [...prev, `✓ Generated "${aiBlogData.title}" (${aiBlogData.readTime || '8 min read'})`]);

            // STEP 3: Save English Blog to MongoDB Atlas
            setCurrentStep(2);
            setStepLogs(prev => [...prev, '⚡ Writing sanitized document to MongoDB Atlas (collection: blogs)...']);

            const postPayload = {
                title: aiBlogData.title,
                slug: aiBlogData.slug,
                category: aiBlogData.category || category,
                excerpt: aiBlogData.excerpt,
                readTime: aiBlogData.readTime || '8 min read',
                featured: uploadedImageUrl,
                tags: aiBlogData.tags || ['AI Automation', 'Web Development'],
                content: aiBlogData.content,
                status: statusOption,
                source: 'ai',
                author: {
                    name: 'Pubudu Tharanga',
                    avatarLight: '/PT_light.jpg',
                    avatarDark: '/PT.jpg'
                }
            };

            const saveRes = await fetch('/api/admin/posts', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postPayload)
            });

            if (!saveRes.ok) {
                const saveErr = await saveRes.json().catch(() => ({}));
                throw new Error(saveErr.error || 'Failed to save blog post to MongoDB');
            }

            const saveResult = await saveRes.json();
            
            // Persist to state and localStorage
            setGeneratedPost(saveResult.post);
            try {
                localStorage.setItem('last_ai_generated_post', JSON.stringify(saveResult.post));
            } catch {}

            // Switch to Blog Preview Studio immediately
            setViewMode('preview');
            setStepLogs(prev => [...prev, `✓ Success! Post live at /blog/${aiBlogData.slug} [Status: ${statusOption}]`]);

            if (onPostPublished) {
                onPostPublished();
            }
        } catch (err) {
            console.error('AI Generation error:', err);
            setErrorMessage(err.message || 'An unexpected error occurred during AI generation');
            setStepLogs(prev => [...prev, `✖ ERROR: ${err.message}`]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopySlug = (slug) => {
        navigator.clipboard.writeText(`${window.location.origin}/blog/${slug}`);
        setCopiedSlug(true);
        setTimeout(() => setCopiedSlug(false), 2000);
    };

    const handleStartNewArticle = () => {
        setTopic('');
        setCustomNotes('');
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setViewMode('create');
    };

    return (
        <div className="space-y-6">
            {/* Top Studio Control Bar */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                        <FaRobot size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                AI Auto-Publisher Studio
                            </h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                                Autonomous Pipeline
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Generate comprehensive technical articles, upload cover thumbnails to Cloudinary, and publish live to MongoDB in 1-click.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {generatedPost && (
                        <button
                            type="button"
                            onClick={() => setViewMode('preview')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                viewMode === 'preview'
                                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaFileAlt size={12} />
                            <span>Last Article</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleStartNewArticle}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                            viewMode === 'create'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        <FaPlus size={11} />
                        <span>Create New Article</span>
                    </button>
                </div>
            </div>

            {/* Error Message Toast */}
            {errorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs"
                >
                    <span>{errorMessage}</span>
                    <button onClick={() => setErrorMessage('')} className="p-1 hover:opacity-75">
                        <FaTimes size={12} />
                    </button>
                </motion.div>
            )}

            {/* Generation Progress Overlay & Terminal Logs */}
            <AnimatePresence>
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="bg-white dark:bg-gray-900 border-2 border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center animate-spin">
                                    <FaSpinner size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                        Publishing Pipeline Running...
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Step {currentStep + 1} of 3 • Autonomous execution
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">
                                {currentStep === 0 ? `${uploadProgress}% Uploaded` : currentStep === 1 ? 'AI Generating...' : 'Database Syncing...'}
                            </span>
                        </div>

                        {/* Animated 3-Step Pipeline */}
                        <div className="grid sm:grid-cols-3 gap-3">
                            {STEPS.map((step, idx) => {
                                const isDone = currentStep > idx;
                                const isCurrent = currentStep === idx;

                                return (
                                    <div
                                        key={step.label}
                                        className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                                            isDone
                                                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                                                : isCurrent
                                                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-sm'
                                                    : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/60 text-gray-400'
                                        }`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {isDone ? (
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                                                    <FaCheck />
                                                </div>
                                            ) : isCurrent ? (
                                                <FaSpinner className="animate-spin text-blue-500 text-sm" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] font-mono">
                                                    {idx + 1}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold leading-snug">{step.label}</p>
                                            <p className="text-[11px] opacity-75 mt-0.5">{step.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* High-Tech Terminal Logs */}
                        <div className="bg-gray-950 text-gray-300 font-mono text-xs p-4 rounded-2xl max-h-40 overflow-y-auto space-y-1.5 border border-gray-800 shadow-inner">
                            <div className="flex items-center gap-2 text-gray-500 pb-1 border-b border-gray-800 text-[10px] uppercase font-bold">
                                <FaTerminal size={10} />
                                <span>Execution Console</span>
                            </div>
                            {stepLogs.map((log, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="text-emerald-400 select-none">❯</span>
                                    <span className="leading-relaxed">{log}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* VIEW MODE 1: ENGLISH BLOG FULL PREVIEW STUDIO */}
            {viewMode === 'preview' && generatedPost && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Header Action Bar */}
                    <div className="bg-white dark:bg-gray-900 border border-emerald-500/40 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                                <FaCheck size={22} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        {generatedPost.status === 'published' ? 'Published Live' : 'Saved as Draft'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopySlug(generatedPost.slug)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        title="Click to copy full URL"
                                    >
                                        <span>/blog/{generatedPost.slug}</span>
                                        {copiedSlug ? <FaCheck size={10} className="text-emerald-500" /> : <FaCopy size={10} className="opacity-60" />}
                                    </button>
                                </div>
                                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mt-1.5">
                                    {generatedPost.title}
                                </h3>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <a
                                href={`/blog/${generatedPost.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <FaExternalLinkAlt size={11} />
                                <span>View Live Article</span>
                            </a>

                            {onOpenLinkedInStudio && (
                                <button
                                    onClick={() => onOpenLinkedInStudio(generatedPost)}
                                    className="px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <FaLinkedin size={13} />
                                    <span>Create LinkedIn Post (සිංහල)</span>
                                </button>
                            )}

                            {onEditPostInManualTab && (
                                <button
                                    onClick={() => onEditPostInManualTab(generatedPost)}
                                    className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold flex items-center gap-2 transition-colors"
                                >
                                    <FaEdit size={12} />
                                    <span>Edit in Manual Studio</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Article Content Render */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                        {generatedPost.featured && (
                            <div className="aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800">
                                <img src={generatedPost.featured} alt={generatedPost.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="max-w-3xl mx-auto space-y-4">
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-extrabold uppercase text-[10px]">
                                    {generatedPost.category}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5"><FaClock size={11} /> {generatedPost.readTime}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                {generatedPost.title}
                            </h1>
                            <div
                                className="blog-content prose prose-lg dark:prose-invert max-w-none pt-4"
                                dangerouslySetInnerHTML={{ __html: generatedPost.content }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* VIEW MODE 2: ARTICLE CREATION FORM */}
            {viewMode === 'create' && (
                <form onSubmit={handleGenerateAndPublish} className="grid lg:grid-cols-3 gap-6">
                    {/* Left 2 Columns: Prompt Engineering & Category */}
                    <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                        {/* Topic Input with Inspiration Quick-Pills */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                    <FaLightbulb className="text-amber-500" size={12} />
                                    <span>Article Topic / Headline</span>
                                    <span className="text-blue-500">*</span>
                                </label>
                                <span className="text-[11px] text-gray-400 font-medium">Clear & specific</span>
                            </div>

                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Why AI Automation Is Changing Modern Business in 2026"
                                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />

                            {/* Inspiration Prompt Quick-Picks */}
                            <div className="mt-3 space-y-1.5">
                                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Quick Inspiration Topics:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {INSPIRATION_PROMPTS.map((prompt) => (
                                        <button
                                            key={prompt}
                                            type="button"
                                            onClick={() => setTopic(prompt)}
                                            className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-medium border border-gray-200/60 dark:border-gray-700/60 transition-all text-left"
                                        >
                                            + {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Category & Audience Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                    <FaFolder size={12} className="text-blue-500" />
                                    <span>Category</span>
                                </label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                    <FaUserGraduate size={12} className="text-indigo-500" />
                                    <span>Target Depth & Audience</span>
                                </label>
                                <Select value={audience} onValueChange={setAudience}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Audience Depth" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AUDIENCE_LEVELS.map((aud) => (
                                            <SelectItem key={aud.label} value={aud.label}>
                                                {aud.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Custom Focus Points / Angle */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                                <span>Custom Angle / Key Highlights (Optional)</span>
                                <span className="text-[11px] text-gray-400 font-normal">Passed to Gemini Prompt</span>
                            </label>
                            <textarea
                                value={customNotes}
                                onChange={(e) => setCustomNotes(e.target.value)}
                                placeholder="e.g., Emphasize practical trade-offs, provide real-world code snippets, and highlight 2026 developer trends..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Column: Visual Media Studio & Publishing */}
                    <div className="space-y-6">
                        {/* Interactive Drag & Drop Thumbnail Console */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                    <FaImage size={12} className="text-blue-500" />
                                    <span>Cover Thumbnail</span>
                                    <span className="text-blue-500">*</span>
                                </label>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-mono">
                                    16:9
                                </span>
                            </div>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden group ${
                                    isDragging
                                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]'
                                        : thumbnailPreview
                                            ? 'border-emerald-400/80 dark:border-emerald-600/80 bg-gray-50 dark:bg-gray-800/40'
                                            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 bg-gray-50/50 dark:bg-gray-800/20'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                                />

                                {thumbnailPreview ? (
                                    <div className="space-y-2.5 w-full">
                                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                                Click to Change Image
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] px-1">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                                <FaCheck size={10} /> {thumbnailFile?.name || 'Image ready'}
                                            </span>
                                            <span className="text-gray-400 font-mono">
                                                {(thumbnailFile?.size ? (thumbnailFile.size / 1024).toFixed(0) : 0)} KB
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 py-2">
                                        <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                                            <FaCloudUploadAlt size={22} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                Drop cover image, or <span className="text-blue-500 underline">browse</span>
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">PNG, JPG, WebP up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Publish Status & Trigger Button */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                                Initial Publish Status
                            </span>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setStatusOption('published')}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                                        statusOption === 'published'
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25'
                                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    <span>🚀 Live Article</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStatusOption('draft')}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                                        statusOption === 'draft'
                                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-500/25'
                                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    <span>📝 Draft Only</span>
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isGenerating || !topic.trim() || !thumbnailFile}
                                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                            >
                                {isGenerating ? (
                                    <>
                                        <FaSpinner className="animate-spin" size={15} />
                                        <span>Executing Autonomous Pipeline...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaMagic size={14} className="text-yellow-300" />
                                        <span>Generate & {statusOption === 'published' ? 'Publish Live' : 'Save Draft'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
