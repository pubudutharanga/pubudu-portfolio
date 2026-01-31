/**
 * ScrollReveal Component - React Bits Inspired
 * 
 * A premium scroll-triggered animation component with blur-fade effects.
 * Splits text into words for staggered reveal animations.
 * Uses Intersection Observer for performance and Framer Motion for smooth animations.
 */

import React, { useRef, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const ScrollReveal = ({
    children,
    baseOpacity = 0,
    enableBlur = true,
    blurStrength = 10,
    duration = 0.8,
    staggerDelay = 0.05,
    y = 20,
    threshold = 0.2,
    triggerOnce = true,
    textReveal = false,
    className = '',
    containerClassName = '',
}) => {
    const prefersReducedMotion = useReducedMotion()
    const [ref, inView] = useInView({
        threshold,
        triggerOnce,
    })

    // If reduced motion is preferred, render without animations
    if (prefersReducedMotion) {
        return <div className={containerClassName}>{children}</div>
    }

    // Text reveal mode - splits text into words
    if (textReveal && typeof children === 'string') {
        const words = children.split(' ')

        return (
            <span ref={ref} className={`inline ${containerClassName}`}>
                {words.map((word, index) => (
                    <motion.span
                        key={index}
                        className={`inline-block mr-[0.25em] ${className}`}
                        initial={{
                            opacity: baseOpacity,
                            y: y,
                            filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
                        }}
                        animate={inView ? {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                        } : {}}
                        transition={{
                            duration: duration,
                            delay: index * staggerDelay,
                            ease: [0.25, 0.1, 0.25, 1], // Smooth cubic bezier
                        }}
                    >
                        {word}
                    </motion.span>
                ))}
            </span>
        )
    }

    // Element reveal mode
    return (
        <motion.div
            ref={ref}
            className={containerClassName}
            initial={{
                opacity: baseOpacity,
                y: y,
                filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
            }}
            animate={inView ? {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
            } : {}}
            transition={{
                duration: duration,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {children}
        </motion.div>
    )
}

/**
 * ScrollRevealContainer - Wrapper for staggered children animations
 */
export const ScrollRevealContainer = ({
    children,
    staggerDelay = 0.1,
    threshold = 0.1,
    triggerOnce = true,
    className = '',
}) => {
    const prefersReducedMotion = useReducedMotion()
    const [ref, inView] = useInView({
        threshold,
        triggerOnce,
    })

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: 'blur(8px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
        >
            {React.Children.map(children, (child, index) => (
                <motion.div key={index} variants={itemVariants}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    )
}

/**
 * BlurFade - Simple blur-fade animation on scroll
 */
export const BlurFade = ({
    children,
    delay = 0,
    duration = 0.6,
    blurAmount = 10,
    yOffset = 25,
    threshold = 0.15,
    triggerOnce = true,
    className = '',
}) => {
    const prefersReducedMotion = useReducedMotion()
    const [ref, inView] = useInView({
        threshold,
        triggerOnce,
    })

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{
                opacity: 0,
                y: yOffset,
                filter: `blur(${blurAmount}px)`,
            }}
            animate={inView ? {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
            } : {}}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {children}
        </motion.div>
    )
}

/**
 * SplitText - Animated text that reveals letter by letter or word by word
 */
export const SplitText = ({
    children,
    splitBy = 'word', // 'word' or 'letter'
    staggerDelay = 0.03,
    duration = 0.5,
    threshold = 0.2,
    triggerOnce = true,
    className = '',
    letterClassName = '',
}) => {
    const prefersReducedMotion = useReducedMotion()
    const [ref, inView] = useInView({
        threshold,
        triggerOnce,
    })

    if (prefersReducedMotion || typeof children !== 'string') {
        return <span className={className}>{children}</span>
    }

    const elements = splitBy === 'letter'
        ? children.split('')
        : children.split(' ')

    return (
        <span ref={ref} className={className}>
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    className={`inline-block ${letterClassName} ${splitBy === 'word' ? 'mr-[0.25em]' : ''}`}
                    initial={{
                        opacity: 0,
                        y: 20,
                        rotateX: 90,
                    }}
                    animate={inView ? {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                    } : {}}
                    transition={{
                        duration,
                        delay: index * staggerDelay,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                    style={{
                        transformStyle: 'preserve-3d',
                        display: element === ' ' ? 'inline' : 'inline-block',
                    }}
                >
                    {element === ' ' ? '\u00A0' : element}
                </motion.span>
            ))}
        </span>
    )
}

export default ScrollReveal
