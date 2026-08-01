import React from 'react'
import { motion } from 'framer-motion'

/**
 * Aceternity LampContainer component adapted for section headings.
 * Provides a dramatic, professional conical spotlight beam effect with soft radial blurring.
 */
export function LampContainer({ children, className = '' }) {
    return (
        <div className={`relative flex flex-col items-center justify-center overflow-visible w-full pt-10 md:pt-14 dark:pt-0 dark:md:pt-0 pb-2 dark:pb-0 z-10 ${className}`}>
            {/* Lamp beams & line assembly (Light mode only) */}
            <div className="relative flex w-full items-center justify-center isolate z-0 dark:hidden">
                {/* Smooth Cascading Spotlight Glow underneath the thin line */}
                <motion.div
                    initial={{ opacity: 0, width: "10rem" }}
                    whileInView={{ opacity: 1, width: "90%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.8, ease: "easeInOut" }}
                    className="absolute top-0 flex items-center justify-center max-w-[38rem] h-40 sm:h-48 pointer-events-none overflow-hidden [mask-image:radial-gradient(ellipse_at_top_center,white_20%,transparent_75%)]"
                >
                    <div className="w-full h-full bg-gradient-to-b from-sky-400/30 via-blue-500/10 to-transparent opacity-50 blur-xl" />
                </motion.div>

                {/* Ambient Center Glow directly on the line */}
                <motion.div
                    initial={{ width: "6rem" }}
                    whileInView={{ width: "20rem" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.8, ease: "easeInOut" }}
                    className="absolute top-0 z-20 h-16 -translate-y-1/2 rounded-full bg-sky-400/20 blur-xl pointer-events-none"
                />

                {/* Ultra-Thin Crisp Glowing Filament Line */}
                <motion.div
                    initial={{ width: "8rem", opacity: 0 }}
                    whileInView={{ width: "85%", opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.9, ease: "easeInOut" }}
                    className="absolute top-0 z-30 h-[1px] max-w-[40rem] w-full bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_8px_#38bdf8]"
                >
                    {/* Intense bright focal core in the center of the line */}
                    <div className="absolute inset-x-1/3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_6px_#ffffff]" />
                </motion.div>
            </div>

            {/* Header Content Wrapper */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10 flex flex-col items-center px-4 text-center mt-3 sm:mt-4 dark:mt-0 dark:sm:mt-0"
            >
                {children}
            </motion.div>
        </div>
    )
}

export default LampContainer
