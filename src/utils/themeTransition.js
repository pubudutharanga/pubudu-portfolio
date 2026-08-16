import { flushSync } from 'react-dom';

let isTransitioning = false;

/**
 * Updates DOM theme classes, color-scheme, and meta theme-color tag.
 *
 * @param {boolean} isDark - Whether the target theme is dark
 */
export function syncThemeToDOM(isDark) {
    if (typeof document === 'undefined') return;

    // 1. Toggle Tailwind dark class on html root
    document.documentElement.classList.toggle('dark', isDark);

    // 2. Set native color-scheme property on root element
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    // 3. Update theme-color meta tag for mobile address bars
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#111827' : '#ffffff');
    }

    // 4. Save preference to localStorage safely
    try {
        localStorage.setItem('dark', isDark.toString());
    } catch (_) {}
}

/**
 * Toggles theme state using the native View Transitions API with an expanding circular clip-path animation.
 * Automatically falls back to standard theme toggling on browsers that lack support or when reduced motion is requested.
 *
 * @param {MouseEvent|TouchEvent|React.MouseEvent|null} event - The click or touch event from the theme toggle button
 * @param {boolean} currentDark - The current dark theme boolean state
 * @param {Function} setDark - The state setter function for the dark theme
 */
export async function toggleThemeWithTransition(event, currentDark, setDark) {
    if (isTransitioning) return;

    const nextDark = !currentDark;

    // Fallback if View Transitions API is unsupported or user prefers reduced motion
    if (
        typeof document === 'undefined' ||
        !document.startViewTransition ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        syncThemeToDOM(nextDark);
        setDark(nextDark);
        return;
    }

    isTransitioning = true;
    document.documentElement.classList.add('transitioning-theme');

    // Determine the origin coordinates (x, y) of the user interaction
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (event) {
        if (
            typeof event.clientX === 'number' &&
            typeof event.clientY === 'number' &&
            (event.clientX !== 0 || event.clientY !== 0)
        ) {
            x = event.clientX;
            y = event.clientY;
        } else if (event.touches && event.touches[0]) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else if (event.currentTarget && typeof event.currentTarget.getBoundingClientRect === 'function') {
            const rect = event.currentTarget.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        } else if (event.target && typeof event.target.getBoundingClientRect === 'function') {
            const rect = event.target.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }
    }

    // Calculate maximum radius to cover the furthest screen corner
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    // Start View Transition with flushSync to guarantee synchronous DOM update
    const transition = document.startViewTransition(() => {
        syncThemeToDOM(nextDark);
        flushSync(() => {
            setDark(nextDark);
        });
    });

    try {
        await transition.ready;

        // Snappy, instantaneous circular wipe reveal animation
        const anim = document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`
                ]
            },
            {
                duration: 350,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                pseudoElement: '::view-transition-new(root)'
            }
        );

        await anim.finished;
    } catch (_) {
        // Silently catch interrupted transitions
    } finally {
        document.documentElement.classList.remove('transitioning-theme');
        isTransitioning = false;
    }
}
