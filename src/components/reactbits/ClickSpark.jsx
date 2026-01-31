import { useRef, useEffect, useCallback } from 'react';

/**
 * ClickSpark - Global click effect with radiating spark lines
 * Shows spark animation on click anywhere - designed for light mode
 * When used without children, it creates a full-screen overlay
 */
const ClickSpark = ({
    sparkColor = '#0ea5e9',
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 400,
    easing = 'ease-out',
    extraScale = 1.0,
    children
}) => {
    const canvasRef = useRef(null);
    const sparksRef = useRef([]);
    const startTimeRef = useRef(null);
    const animationIdRef = useRef(null);

    // Check if this is a global (full-screen) usage
    const isGlobal = !children;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            if (isGlobal) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            } else {
                const parent = canvas.parentElement;
                if (parent) {
                    const { width, height } = parent.getBoundingClientRect();
                    if (canvas.width !== width || canvas.height !== height) {
                        canvas.width = width;
                        canvas.height = height;
                    }
                }
            }
        };

        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 100);
        };

        if (isGlobal) {
            window.addEventListener('resize', handleResize);
            resizeCanvas();
            return () => {
                window.removeEventListener('resize', handleResize);
                clearTimeout(resizeTimeout);
            };
        } else {
            const parent = canvas.parentElement;
            if (parent) {
                const ro = new ResizeObserver(handleResize);
                ro.observe(parent);
                resizeCanvas();
                return () => {
                    ro.disconnect();
                    clearTimeout(resizeTimeout);
                };
            }
        }
    }, [isGlobal]);

    const easeFunc = useCallback(
        t => {
            switch (easing) {
                case 'linear':
                    return t;
                case 'ease-in':
                    return t * t;
                case 'ease-in-out':
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                default:
                    return t * (2 - t);
            }
        },
        [easing]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const draw = timestamp => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            sparksRef.current = sparksRef.current.filter(spark => {
                const elapsed = timestamp - spark.startTime;
                if (elapsed >= duration) {
                    return false;
                }

                const progress = elapsed / duration;
                const eased = easeFunc(progress);

                const distance = eased * sparkRadius * extraScale;
                const lineLength = sparkSize * (1 - eased);

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                ctx.strokeStyle = sparkColor;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                return true;
            });

            animationIdRef.current = requestAnimationFrame(draw);
        };

        animationIdRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, [sparkColor, sparkSize, sparkRadius, duration, easeFunc, extraScale]);

    // Global click handler
    useEffect(() => {
        if (!isGlobal) return;

        const handleGlobalClick = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const x = e.clientX;
            const y = e.clientY;

            const now = performance.now();
            const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
                x,
                y,
                angle: (2 * Math.PI * i) / sparkCount,
                startTime: now
            }));

            sparksRef.current.push(...newSparks);
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [isGlobal, sparkCount]);

    const handleClick = e => {
        if (isGlobal) return; // Global click is handled separately

        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const now = performance.now();
        const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
            x,
            y,
            angle: (2 * Math.PI * i) / sparkCount,
            startTime: now
        }));

        sparksRef.current.push(...newSparks);
    };

    // Global full-screen mode
    if (isGlobal) {
        return (
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-50"
                style={{ pointerEvents: 'none' }}
            />
        );
    }

    // Container mode with children
    return (
        <div className="relative w-full h-full" onClick={handleClick}>
            <canvas ref={canvasRef} className="w-full h-full block absolute top-0 left-0 select-none pointer-events-none" />
            {children}
        </div>
    );
};

export default ClickSpark;
