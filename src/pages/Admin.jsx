import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaRobot,
    FaEdit,
    FaThList,
    FaLinkedin,
    FaSignOutAlt,
    FaExternalLinkAlt,
    FaShieldAlt,
    FaSpinner,
    FaDatabase,
    FaCloud,
    FaBolt,
    FaKeyboard
} from 'react-icons/fa';
import SeoMeta from '../components/SeoMeta';
import { useAdminSession } from '../hooks/useAdminSession';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut
} from '../components/ui/DropdownMenu';
import AuthGate from './Admin/AuthGate';
import AiPublisherTab from './Admin/AiPublisherTab';
import ManualEditorTab from './Admin/ManualEditorTab';
import BlogManagerTab from './Admin/BlogManagerTab';
import LinkedInStudioTab from './Admin/LinkedInStudioTab';

export default function Admin() {
    const { isAuthenticated, isLoading, error, login, logout } = useAdminSession();
    const [activeTab, setActiveTab] = useState('ai'); // 'ai', 'manual', 'manage', 'linkedin'
    const [postToEditInManual, setPostToEditInManual] = useState(null);
    const [postForLinkedIn, setPostForLinkedIn] = useState(null);

    // Tab items with metadata & keyboard shortcuts
    const TABS = [
        {
            id: 'ai',
            label: 'AI Auto-Publisher',
            badge: 'Gemini 2.0',
            badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            icon: FaRobot,
            key: '1'
        },
        {
            id: 'manual',
            label: 'Manual Studio',
            badge: 'Split-Pane',
            badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
            icon: FaEdit,
            key: '2'
        },
        {
            id: 'manage',
            label: 'Manage Articles',
            badge: 'Data Table',
            badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            icon: FaThList,
            key: '3'
        },
        {
            id: 'linkedin',
            label: 'LinkedIn Studio',
            badge: 'සිංහල AI',
            badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
            icon: FaLinkedin,
            key: '4'
        }
    ];

    // Enable 1-4 keyboard shortcuts when not typing in an input
    useEffect(() => {
        const handleKeyDown = (e) => {
            const activeEl = document.activeElement;
            const isTyping = activeEl && (
                activeEl.tagName === 'INPUT' ||
                activeEl.tagName === 'TEXTAREA' ||
                activeEl.isContentEditable
            );
            if (isTyping) return;

            if (e.key === '1') setActiveTab('ai');
            else if (e.key === '2') setActiveTab('manual');
            else if (e.key === '3') setActiveTab('manage');
            else if (e.key === '4') setActiveTab('linkedin');
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Navigation callbacks
    const handleEditPost = (post) => {
        setPostToEditInManual(post);
        setActiveTab('manual');
    };

    const handleOpenLinkedInStudio = (post) => {
        setPostForLinkedIn(post);
        setActiveTab('linkedin');
    };

    const handleClearEditPost = () => {
        setPostToEditInManual(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-[85vh] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center animate-pulse">
                        <FaShieldAlt className="text-3xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <FaSpinner className="animate-spin text-xl text-blue-500 absolute -bottom-1 -right-1" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Authenticating Studio Session</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Verifying encrypted admin credentials...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <SeoMeta
                    title="Admin Access | Pubudu Tharanga"
                    description="Secure admin access portal for portfolio content management."
                />
                <AuthGate onLogin={login} isLoading={isLoading} error={error} />
            </>
        );
    }

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-20 px-3 sm:px-6 lg:px-10 max-w-[1540px] mx-auto transition-all">
            <SeoMeta
                title="Content Studio Command Center | Pubudu Tharanga"
                description="Modern dual-mode technical blog publisher, asset CDN manager, and Sinhala social studio."
            />

            {/* Top Studio Command Shell */}
            <header className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-4 sm:p-6 shadow-sm mb-6 transition-all">
                {/* Subtle Ambient Glow */}
                <div className="absolute top-0 right-1/4 w-96 h-24 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Brand & Live Telemetry Info */}
                    <div className="flex items-center gap-4">
                        <div className="relative group shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
                                <FaBolt size={22} className="text-yellow-300 drop-shadow-sm" />
                            </div>
                            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900"></span>
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
                                    Pubudu Studio
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300/80 dark:border-emerald-800 flex items-center gap-1.5 shadow-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live Mode
                                </span>
                            </div>

                            {/* Service Status Telemetry Badges */}
                            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                <span className="inline-flex items-center gap-1">
                                    <FaDatabase className="text-emerald-500" size={10} />
                                    <span>Atlas DB</span>
                                </span>
                                <span className="text-gray-300 dark:text-gray-700">•</span>
                                <span className="inline-flex items-center gap-1">
                                    <FaCloud className="text-sky-500" size={10} />
                                    <span>Cloudinary CDN</span>
                                </span>
                                <span className="text-gray-300 dark:text-gray-700">•</span>
                                <span className="inline-flex items-center gap-1">
                                    <FaRobot className="text-purple-500" size={10} />
                                    <span>Gemini AI Engine</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Action Controls */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {/* Keyboard Hint Pill */}
                        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 text-[11px] text-gray-500 dark:text-gray-400">
                            <FaKeyboard size={11} className="text-gray-400" />
                            <span>Press</span>
                            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-[10px] font-bold font-mono">1-4</kbd>
                            <span>to switch tabs</span>
                        </div>

                        {/* View Live Blog */}
                        <a
                            href="/blog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
                        >
                            <span>Live Blog</span>
                            <FaExternalLinkAlt size={10} className="opacity-70" />
                        </a>

                        {/* Admin Profile & Radix UI Dropdown Menu */}
                        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200/80 dark:border-gray-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                                        title="Admin Profile Menu"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                            PT
                                        </div>
                                        <div className="hidden sm:block text-left">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Pubudu</p>
                                            <p className="text-[10px] text-gray-400 font-mono leading-tight">Admin</p>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-60">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-gray-900 dark:text-white text-xs">Pubudu Tharanga</span>
                                            <span className="text-[10px] text-gray-400 font-normal lowercase">pubudu.admin@live</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuLabel>Quick Switch</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setActiveTab('ai')}>
                                        <FaRobot size={12} className="text-blue-500" />
                                        <span>AI Auto-Publisher</span>
                                        <DropdownMenuShortcut>1</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setActiveTab('manual')}>
                                        <FaEdit size={12} className="text-emerald-500" />
                                        <span>Manual Blog Studio</span>
                                        <DropdownMenuShortcut>2</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setActiveTab('manage')}>
                                        <FaThList size={12} className="text-amber-500" />
                                        <span>Manage Articles</span>
                                        <DropdownMenuShortcut>3</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setActiveTab('linkedin')}>
                                        <FaLinkedin size={12} className="text-[#0A66C2]" />
                                        <span>Sinhala LinkedIn Studio</span>
                                        <DropdownMenuShortcut>4</DropdownMenuShortcut>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <a href="/blog" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                                            <FaExternalLinkAlt size={11} className="text-gray-400" />
                                            <span>Open Live Blog ↗</span>
                                        </a>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem destructive onClick={logout}>
                                        <FaSignOutAlt size={12} />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                                onClick={logout}
                                className="px-3 py-2 rounded-xl border border-red-200/70 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                                title="Sign out of Admin Dashboard"
                            >
                                <FaSignOutAlt size={11} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Studio Segmented Navigation Bar */}
                <nav className="relative flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-4 mt-4 border-t border-gray-100 dark:border-gray-800/80 scrollbar-none">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 select-none ${
                                    isActive
                                        ? 'text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/50'
                                }`}
                            >
                                {/* Framer Motion Gliding Active Pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="adminNavPill"
                                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-md shadow-blue-500/25"
                                    />
                                )}

                                <span className="relative z-10 flex items-center gap-2">
                                    <Icon size={14} className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                                    <span>{tab.label}</span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                                            isActive
                                                ? 'bg-white/20 text-white border-white/20'
                                                : `${tab.badgeColor}`
                                        }`}
                                    >
                                        {tab.badge}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </header>

            {/* Main Content Workspace Pane */}
            <main className="transition-all">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                    >
                        {activeTab === 'ai' && (
                            <AiPublisherTab
                                onEditPostInManualTab={handleEditPost}
                                onOpenLinkedInStudio={handleOpenLinkedInStudio}
                                onPostPublished={() => {}}
                            />
                        )}

                        {activeTab === 'manual' && (
                            <ManualEditorTab
                                initialPostData={postToEditInManual}
                                onPostSaved={() => {
                                    setPostToEditInManual(null);
                                }}
                                onClearEditPost={handleClearEditPost}
                            />
                        )}

                        {activeTab === 'manage' && (
                            <BlogManagerTab
                                onEditPost={handleEditPost}
                                onOpenLinkedInStudio={handleOpenLinkedInStudio}
                            />
                        )}

                        {activeTab === 'linkedin' && (
                            <LinkedInStudioTab
                                initialSelectedPost={postForLinkedIn}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
