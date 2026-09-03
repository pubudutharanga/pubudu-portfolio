import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaLinkedin,
    FaRobot,
    FaCopy,
    FaCheck,
    FaExternalLinkAlt,
    FaSpinner,
    FaFileAlt,
    FaMagic,
    FaTimes,
    FaThumbsUp,
    FaComment,
    FaShare,
    FaPaperPlane,
    FaEdit,
    FaEye,
    FaHashtag,
    FaGlobeAmericas
} from 'react-icons/fa';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '../../components/ui/Select';

const TONE_PRESETS = [
    { id: 'viral', label: '🚀 Viral Storytelling', desc: 'Hook + personal experience + actionable lesson' },
    { id: 'tech', label: '🧠 Technical Breakdown', desc: 'Architecture, trade-offs, and best practices' },
    { id: 'tips', label: '⚡ Actionable Tips', desc: 'Numbered list, quick wins, and developer tools' },
    { id: 'leadership', label: '💡 Thought Leadership', desc: '2026 industry trends, future outlook & advice' }
];

export default function LinkedInStudioTab({ initialSelectedPost = null }) {
    const [existingPosts, setExistingPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(initialSelectedPost?.slug || '');
    const [customTopic, setCustomTopic] = useState(initialSelectedPost?.title || '');
    const [selectedTone, setSelectedTone] = useState(TONE_PRESETS[0].id);
    const [customNotes, setCustomNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [sinhalaResult, setSinhalaResult] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeView, setActiveView] = useState('preview'); // 'preview' or 'raw'

    // Fetch existing posts for quick selection dropdown
    useEffect(() => {
        async function loadPosts() {
            try {
                const res = await fetch('/api/admin/posts?limit=50&status=all', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (res.ok) {
                    const data = await res.json();
                    setExistingPosts(data.posts || []);
                }
            } catch (err) {
                console.error('Failed to load posts list for LinkedIn studio:', err);
            }
        }
        loadPosts();
    }, []);

    // Update if initialSelectedPost changes
    useEffect(() => {
        if (initialSelectedPost) {
            setSelectedPostId(initialSelectedPost.slug || '');
            setCustomTopic(initialSelectedPost.title || '');
        }
    }, [initialSelectedPost]);

    // Handle post select change
    const handleSelectPostChange = (slug) => {
        setSelectedPostId(slug);
        const found = existingPosts.find(p => p.slug === slug);
        if (found) {
            setCustomTopic(found.title);
        }
    };

    // Generate Sinhala LinkedIn Post
    const handleGenerate = async (e) => {
        e.preventDefault();
        const selectedPost = existingPosts.find(p => p.slug === selectedPostId);

        if (!customTopic && !selectedPost) {
            setErrorMessage('Please choose an existing article or enter a topic.');
            return;
        }

        setIsGenerating(true);
        setErrorMessage('');

        const toneObj = TONE_PRESETS.find(t => t.id === selectedTone);
        const combinedNotes = [
            `Tone Style: ${toneObj ? toneObj.label : 'Viral Storytelling'} (${toneObj?.desc || ''})`,
            customNotes
        ].filter(Boolean).join('\n');

        try {
            const res = await fetch('/api/admin/generate', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'linkedin',
                    postData: selectedPost ? {
                        title: selectedPost.title,
                        excerpt: selectedPost.excerpt,
                        slug: selectedPost.slug
                    } : {
                        title: customTopic,
                        slug: customTopic.toLowerCase().replace(/[^a-z0-9]/g, '-')
                    },
                    customNotes: combinedNotes
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to generate Sinhala LinkedIn post');
            }

            const data = await res.json();
            setSinhalaResult(data.data);
            setActiveView('preview');
        } catch (err) {
            setErrorMessage(err.message || 'Generation error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!sinhalaResult?.sinhalaPost) return;
        navigator.clipboard.writeText(sinhalaResult.sinhalaPost);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    const charCount = sinhalaResult?.sinhalaPost?.length || 0;
    const hashtagCount = (sinhalaResult?.sinhalaPost?.match(/#[\w\u0D80-\u0DFF]+/g) || []).length;

    return (
        <div className="space-y-6">
            {/* Studio Header Bar */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0A66C2] text-white flex items-center justify-center shadow-lg shadow-sky-600/25 shrink-0">
                        <FaLinkedin size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                Sinhala LinkedIn Post Studio
                            </h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/50 text-[#0A66C2] dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-mono">
                                සිංහල AI
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Transform technical articles into viral, high-engagement Sinhala LinkedIn posts with emojis, hooks, and clean English technical terminology.
                        </p>
                    </div>
                </div>

                {sinhalaResult?.sinhalaPost && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isCopied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                            <span>{isCopied ? 'Copied to Clipboard!' : '1-Click Copy Post'}</span>
                        </button>
                        <a
                            href="https://www.linkedin.com/feed/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-xs"
                            title="Open LinkedIn in New Tab"
                        >
                            <FaExternalLinkAlt size={12} />
                        </a>
                    </div>
                )}
            </div>

            {/* Error Message Toast */}
            {errorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs"
                >
                    <span>{errorMessage}</span>
                    <button onClick={() => setErrorMessage('')}><FaTimes /></button>
                </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column: Generator Form & Presets */}
                <form onSubmit={handleGenerate} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <FaFileAlt size={11} className="text-[#0A66C2]" />
                            <span>Article Source & Tone Strategy</span>
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                            {existingPosts.length} published articles available
                        </span>
                    </div>

                    {/* Choose Existing Article */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                            Select Existing Blog Article
                        </label>
                        <Select
                            value={selectedPostId || '__custom__'}
                            onValueChange={(val) => handleSelectPostChange(val === '__custom__' ? '' : val)}
                        >
                            <SelectTrigger className="py-2.5">
                                <SelectValue placeholder="-- Custom Topic / Standalone Post --" />
                            </SelectTrigger>
                            <SelectContent className="max-w-[420px]">
                                <SelectItem value="__custom__">
                                    -- Custom Topic / Standalone Post --
                                </SelectItem>
                                {existingPosts.map((p) => (
                                    <SelectItem key={p.slug} value={p.slug}>
                                        {p.title} ({p.category})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Topic Title */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                            Post Topic / Headline <span className="text-blue-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            placeholder="e.g. Next.js 15 Server Actions Architecture"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Tone Style Preset Cards */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                            Post Style & Engagement Formula
                        </label>
                        <div className="grid sm:grid-cols-2 gap-2">
                            {TONE_PRESETS.map((preset) => {
                                const isSelected = selectedTone === preset.id;
                                return (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => setSelectedTone(preset.id)}
                                        className={`p-3 rounded-2xl border text-left transition-all ${
                                            isSelected
                                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                                                : 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-200/80 dark:border-gray-700/60 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        <p className="text-xs font-bold">{preset.label}</p>
                                        <p className="text-[10px] opacity-75 mt-0.5 leading-snug">{preset.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Prompt Notes */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
                            <span>Specific Angle / Focus Point (Optional)</span>
                            <span className="text-[11px] text-gray-400 font-normal">e.g., target junior devs, emphasize cost</span>
                        </label>
                        <textarea
                            value={customNotes}
                            onChange={(e) => setCustomNotes(e.target.value)}
                            placeholder="e.g. Focus on practical lessons from production incidents, keep emojis moderate, use conversational Sinhala..."
                            rows={3}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isGenerating || (!customTopic && !selectedPostId)}
                        className="w-full py-3.5 px-6 rounded-2xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                    >
                        {isGenerating ? (
                            <>
                                <FaSpinner className="animate-spin" size={15} />
                                <span>Synthesizing Viral Sinhala Post...</span>
                            </>
                        ) : (
                            <>
                                <FaMagic size={14} className="text-yellow-300" />
                                <span>Generate Sinhala LinkedIn Post</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Right Column: Realistic LinkedIn Feed Post Simulator */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col space-y-4">
                    {/* View Switcher & Status Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1.5">
                            <FaLinkedin className="text-[#0A66C2]" size={15} />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                LinkedIn Feed Simulator
                            </span>
                        </div>

                        {sinhalaResult?.sinhalaPost && (
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setActiveView('preview')}
                                        className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] flex items-center gap-1 ${
                                            activeView === 'preview'
                                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        <FaEye size={10} />
                                        <span>Feed View</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveView('raw')}
                                        className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] flex items-center gap-1 ${
                                            activeView === 'raw'
                                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        <FaEdit size={10} />
                                        <span>Edit Text</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {sinhalaResult?.sinhalaPost ? (
                        <div className="flex-1 flex flex-col space-y-3">
                            {/* Realistic Feed Card */}
                            {activeView === 'preview' ? (
                                <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-white dark:bg-gray-950/60 shadow-sm space-y-3.5 flex-1">
                                    {/* Author Profile Bar */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0 border-2 border-white dark:border-gray-800 shadow-xs">
                                            PT
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                                                    Pubudu Tharanga
                                                </h4>
                                                <span className="text-[10px] text-gray-400">• 1st</span>
                                            </div>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                Full Stack Developer | AI & Cloud Architecture
                                            </p>
                                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                                <span>Just now</span>
                                                <span>•</span>
                                                <FaGlobeAmericas size={9} />
                                            </p>
                                        </div>
                                    </div>

                                    {/* Post Sinhala Body */}
                                    <div className="text-xs sm:text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-sans max-h-[460px] overflow-y-auto pr-1">
                                        {sinhalaResult.sinhalaPost}
                                    </div>

                                    {/* LinkedIn Simulated Engagement Bar */}
                                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80">
                                        <div className="flex items-center justify-between text-[11px] text-gray-400 pb-2">
                                            <span className="flex items-center gap-1">
                                                <span className="w-4 h-4 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-[8px]">
                                                    <FaThumbsUp />
                                                </span>
                                                <span>48 reactions</span>
                                            </span>
                                            <span>12 comments • 6 reposts</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1 pt-1 text-gray-500 dark:text-gray-400 text-xs font-semibold text-center border-t border-gray-100 dark:border-gray-800">
                                            <div className="py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 cursor-pointer">
                                                <FaThumbsUp size={11} /> <span>Like</span>
                                            </div>
                                            <div className="py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 cursor-pointer">
                                                <FaComment size={11} /> <span>Comment</span>
                                            </div>
                                            <div className="py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 cursor-pointer">
                                                <FaShare size={11} /> <span>Repost</span>
                                            </div>
                                            <div className="py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 cursor-pointer">
                                                <FaPaperPlane size={11} /> <span>Send</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Raw Text Editor */
                                <div className="flex-1 flex flex-col space-y-2">
                                    <textarea
                                        value={sinhalaResult.sinhalaPost}
                                        onChange={(e) => setSinhalaResult({ ...sinhalaResult, sinhalaPost: e.target.value })}
                                        rows={18}
                                        className="w-full flex-1 bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-xs font-sans text-gray-900 dark:text-gray-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y shadow-inner"
                                    />
                                    <p className="text-[11px] text-gray-400 italic">
                                        💡 Tip: Edits made here immediately update the live feed preview card.
                                    </p>
                                </div>
                            )}

                            {/* Analytics Footer */}
                            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 px-1 pt-1 font-mono">
                                <div className="flex items-center gap-3">
                                    <span className={charCount > 2800 ? 'text-amber-500 font-bold' : ''}>
                                        {charCount} / 3,000 chars
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <FaHashtag size={9} />
                                        <span>{hashtagCount} hashtags</span>
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="font-bold text-[#0A66C2] hover:underline flex items-center gap-1"
                                >
                                    {isCopied ? <FaCheck /> : <FaCopy />}
                                    <span>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-400 space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-[#0A66C2] dark:text-sky-400 flex items-center justify-center">
                                <FaRobot size={28} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Sinhala Feed Simulator Ready
                                </h4>
                                <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                                    Choose an existing blog article or enter a topic on the left, then click Generate to create a viral Sinhala LinkedIn post.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
