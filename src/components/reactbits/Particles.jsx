/**
 * Particles Component - React Bits Inspired
 * 
 * A stunning canvas-based particle animation with mouse interactivity,
 * connection lines between nearby particles, and dark mode support.
 * Optimized for performance using RequestAnimationFrame.
 */

import React, { useRef, useEffect, useCallback, useMemo } from 'react'

const Particles = ({
    particleCount = 80,
    particleColors = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#818cf8', '#a78bfa'],
    lineColor = 'rgba(14, 165, 233, 0.15)',
    particleMinSize = 1,
    particleMaxSize = 3,
    speed = 0.5,
    connectionDistance = 150,
    mouseRadius = 120,
    mouseForce = 0.08,
    className = '',
    dark = false,
}) => {
    const canvasRef = useRef(null)
    const particlesRef = useRef([])
    const mouseRef = useRef({ x: null, y: null })
    const animationRef = useRef(null)
    const dimensionsRef = useRef({ width: 0, height: 0 })

    // Adjust colors for dark mode
    const colors = useMemo(() => {
        if (dark) {
            return ['#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#38bdf8']
        }
        return particleColors
    }, [dark, particleColors])

    const lineColorAdjusted = useMemo(() => {
        return dark ? 'rgba(96, 165, 250, 0.12)' : lineColor
    }, [dark, lineColor])

    // Initialize particles
    const initParticles = useCallback((width, height) => {
        const particles = []
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                size: Math.random() * (particleMaxSize - particleMinSize) + particleMinSize,
                color: colors[Math.floor(Math.random() * colors.length)],
                originalX: 0,
                originalY: 0,
                opacity: Math.random() * 0.5 + 0.5,
            })
        }
        return particles
    }, [particleCount, particleMaxSize, particleMinSize, speed, colors])

    // Animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        const { width, height } = dimensionsRef.current
        const particles = particlesRef.current
        const mouse = mouseRef.current

        // Clear canvas
        ctx.clearRect(0, 0, width, height)

        // Update and draw particles
        particles.forEach((particle, i) => {
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - particle.x
                const dy = mouse.y - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < mouseRadius) {
                    const force = (mouseRadius - distance) / mouseRadius
                    particle.vx -= (dx / distance) * force * mouseForce
                    particle.vy -= (dy / distance) * force * mouseForce
                }
            }

            // Update position
            particle.x += particle.vx
            particle.y += particle.vy

            // Apply friction
            particle.vx *= 0.99
            particle.vy *= 0.99

            // Add slight random movement
            particle.vx += (Math.random() - 0.5) * 0.02
            particle.vy += (Math.random() - 0.5) * 0.02

            // Boundary handling - wrap around
            if (particle.x < 0) particle.x = width
            if (particle.x > width) particle.x = 0
            if (particle.y < 0) particle.y = height
            if (particle.y > height) particle.y = 0

            // Draw particle with glow effect
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.globalAlpha = particle.opacity
            ctx.fill()

            // Draw glow
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            )
            gradient.addColorStop(0, particle.color)
            gradient.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
            ctx.fillStyle = gradient
            ctx.globalAlpha = particle.opacity * 0.3
            ctx.fill()

            ctx.globalAlpha = 1

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const other = particles[j]
                const dx = particle.x - other.x
                const dy = particle.y - other.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.5
                    ctx.beginPath()
                    ctx.moveTo(particle.x, particle.y)
                    ctx.lineTo(other.x, other.y)
                    ctx.strokeStyle = lineColorAdjusted
                    ctx.globalAlpha = opacity
                    ctx.lineWidth = 0.5
                    ctx.stroke()
                    ctx.globalAlpha = 1
                }
            }
        })

        animationRef.current = requestAnimationFrame(animate)
    }, [connectionDistance, lineColorAdjusted, mouseForce, mouseRadius])

    // Handle resize
    const handleResize = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const parent = canvas.parentElement
        if (!parent) return

        const { width, height } = parent.getBoundingClientRect()

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1
        canvas.width = width * dpr
        canvas.height = height * dpr
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        const ctx = canvas.getContext('2d')
        ctx.scale(dpr, dpr)

        dimensionsRef.current = { width, height }

        // Reinitialize particles on significant resize
        if (particlesRef.current.length === 0 ||
            Math.abs(particlesRef.current.length - particleCount) > 10) {
            particlesRef.current = initParticles(width, height)
        }
    }, [initParticles, particleCount])

    // Mouse handlers
    const handleMouseMove = useCallback((e) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }, [])

    const handleMouseLeave = useCallback(() => {
        mouseRef.current = { x: null, y: null }
    }, [])

    // Setup and cleanup
    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        handleResize()
        particlesRef.current = initParticles(
            dimensionsRef.current.width,
            dimensionsRef.current.height
        )

        animate()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [animate, handleResize, initParticles])

    // Reinitialize when colors change (dark mode toggle)
    useEffect(() => {
        const { width, height } = dimensionsRef.current
        if (width && height) {
            particlesRef.current = initParticles(width, height)
        }
    }, [colors, initParticles])

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 pointer-events-auto ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-hidden="true"
        />
    )
}

export default Particles
