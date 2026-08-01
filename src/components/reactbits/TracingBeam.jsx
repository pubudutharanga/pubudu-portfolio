import React, { useEffect, useRef, useState } from 'react'
import { motion, useTransform, useScroll, useSpring } from 'framer-motion'

/**
 * Aceternity TracingBeam component
 * Renders an animated laser beam that traces down alongside the content as the user scrolls.
 * Automatically measures height via ResizeObserver for seamless responsiveness.
 */
export default function TracingBeam({ children, className = '' }) {
    const containerRef = useRef(null)
    const contentRef = useRef(null)
    const [svgHeight, setSvgHeight] = useState(0)

    useEffect(() => {
        if (contentRef.current) {
            setSvgHeight(contentRef.current.offsetHeight)
        }
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setSvgHeight(entry.target.offsetHeight)
            }
        })
        if (contentRef.current) {
            observer.observe(contentRef.current)
        }
        return () => observer.disconnect()
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    })

    // Smooth physics-based spring animation for the beam gradients
    const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
        stiffness: 500,
        damping: 90,
    })
    const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), {
        stiffness: 500,
        damping: 90,
    })

    return (
        <div ref={containerRef} className={`relative w-full max-w-7xl mx-auto ${className}`}>
            {/* Tracing Beam SVG & Dot Assembly (Visible on md+ screens to avoid horizontal overflow on mobile) */}
            <div className="absolute -left-2 md:-left-6 lg:-left-12 top-3 hidden md:block z-40 pointer-events-none">
                <div className="sticky top-24 left-0 flex flex-col items-center">
                    {/* Glowing Apex Dot */}
                    <div className="h-4 w-4 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border border-sky-400 dark:border-cyan-400 shadow-[0_0_12px_#00ffff]">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.8, 1, 0.8],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="h-2 w-2 rounded-full bg-sky-500 dark:bg-cyan-300 shadow-[0_0_8px_#38bdf8]"
                        />
                    </div>

                    {/* SVG Tracing Line */}
                    <svg
                        viewBox={`0 0 20 ${svgHeight}`}
                        width="20"
                        height={svgHeight}
                        className="ml-4 block overflow-visible"
                        aria-hidden="true"
                    >
                        {/* Static Base Fading Track */}
                        <path
                            d={`M 1 0 V 20 l 18 24 V ${Math.max(0, svgHeight - 44)} l -18 24 V ${svgHeight}`}
                            fill="none"
                            className="stroke-gray-300 dark:stroke-gray-700/60"
                            strokeOpacity="0.4"
                            strokeWidth="2"
                        />
                        {/* Dynamic Neon Laser Path */}
                        <motion.path
                            d={`M 1 0 V 20 l 18 24 V ${Math.max(0, svgHeight - 44)} l -18 24 V ${svgHeight}`}
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            className="motion-reduce:hidden"
                        />
                        <defs>
                            <motion.linearGradient
                                id="gradient"
                                gradientUnits="userSpaceOnUse"
                                x1="0"
                                x2="0"
                                y1={y1}
                                y2={y2}
                            >
                                <stop stopColor="#00ffff" stopOpacity="0" />
                                <stop stopColor="#00ffff" />
                                <stop offset="0.325" stopColor="#3b82f6" />
                                <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
                            </motion.linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Content Wrapper */}
            <div ref={contentRef} className="relative w-full">
                {children}
            </div>
        </div>
    )
}
