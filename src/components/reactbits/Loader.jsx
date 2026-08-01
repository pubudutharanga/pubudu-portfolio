import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DEFAULT_LOADING_STATES = [
    "Initializing MERN architecture...",
    "Loading interactive experiences...",
    "Configuring AI & web engineering insights...",
    "Optimizing assets for peak performance...",
    "Welcome to Pubudu's portfolio!"
]

/**
 * Aceternity Loader One component
 * A premium multi-step animated loading indicator featuring dual-axis orbital rings,
 * cycling status messages, and smooth shimmer progress tracking.
 */
export default function Loader({ 
    loadingStates = DEFAULT_LOADING_STATES, 
    duration = 1800, 
    fullScreen = false, 
    className = "" 
}) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (!loadingStates || loadingStates.length === 0) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % loadingStates.length)
        }, duration)
        return () => clearInterval(interval)
    }, [loadingStates, duration])

    const LoaderContent = (
        <div className={`relative flex flex-col items-center justify-center p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 shadow-2xl max-w-sm w-full mx-auto ${className}`}>
            {/* Ambient background glow inside loader card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl pointer-events-none blur-xl" />

            {/* Orbital Spinning Assembly */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-8 isolate">
                {/* Outer glowing orbital ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-purple-500 shadow-[0_0_15px_rgba(56,189,248,0.4)] dark:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                />

                {/* Counter-rotating inner orbital track */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-3 rounded-full border-2 border-dashed border-cyan-400/60 dark:border-cyan-300/60"
                />

                {/* Pulsing Core Focal Dot */}
                <motion.div
                    animate={{ 
                        scale: [0.8, 1.25, 0.8],
                        opacity: [0.6, 1, 0.6] 
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-4 h-4 rounded-full bg-gradient-to-r from-sky-400 to-purple-500 shadow-[0_0_12px_#38bdf8]"
                />
            </div>

            {/* Multi-step text rotator */}
            <div className="h-8 flex items-center justify-center overflow-hidden w-full px-2 text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200 tracking-wide truncate"
                    >
                        {loadingStates[currentIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Shimmering infinity progress bar */}
            <div className="w-48 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-6 relative">
                <motion.div
                    animate={{
                        x: ["-100%", "200%"]
                    }}
                    transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-sky-400 dark:via-cyan-300 to-transparent rounded-full shadow-[0_0_8px_#38bdf8]"
                />
            </div>
        </div>
    )

    if (fullScreen) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white dark:bg-gray-900 relative z-50">
                {/* Subtle background radial gradient for fullScreen state */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/50 pointer-events-none" />
                <div className="relative z-10 w-full flex justify-center">
                    {LoaderContent}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex items-center justify-center py-12 px-4">
            {LoaderContent}
        </div>
    )
}
