/**
 * Toggles theme state using the native View Transitions API with an expanding circular clip-path animation.
 * Automatically falls back to standard theme toggling on browsers that lack support or when reduced motion is requested.
 *
 * @param {MouseEvent|TouchEvent|React.MouseEvent} event - The click or touch event from the theme toggle icon
 * @param {boolean} currentDark - The current dark theme boolean state
 * @param {Function} setDark - The state setter function for the dark theme
 */
export async function toggleThemeWithTransition(event, currentDark, setDark) {
    const nextDark = !currentDark;

    // Fallback if View Transitions API is unsupported or user prefers reduced motion
    if (
        !document.startViewTransition ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        setDark(nextDark);
        return;
    }

    // Capture coordinates of the user interaction (mouse click or touch point)
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (event && event.preventDefault && event.stopPropagation && typeof event.persist === 'function') {
        try { event.persist(); } catch (_) { /* Ignore React 18+ syntax warning */ }
    }

    if (event) {
        if (event.clientX !== undefined && event.clientY !== undefined && (event.clientX !== 0 || event.clientY !== 0)) {
            x = event.clientX;
            y = event.clientY;
        } else if (event.touches && event.touches[0]) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else if (event.currentTarget && typeof event.currentTarget.getBoundingClientRect === 'function') {
            const rect = event.currentTarget.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }
    }

    // Calculate maximum radius (hypotenuse to farthest screen corner)
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    // Start View Transition
    const transition = document.startViewTransition(() => {
        setDark(nextDark);
    });

    try {
        // Animate the circular clip-path when DOM snapshot is ready
        await transition.ready;

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`
                ]
            },
            {
                duration: 600,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                pseudoElement: '::view-transition-new(root)'
            }
        );
    } catch (e) {
        // Transition was canceled or finished prematurely, ignore silently
    }
}
