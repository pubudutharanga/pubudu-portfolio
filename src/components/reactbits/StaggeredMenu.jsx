import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FiSun, FiMoon } from 'react-icons/fi';

export const StaggeredMenu = ({
    position = 'right',
    colors = ['#B19EEF', '#5227FF'],
    items = [],
    socialItems = [],
    displaySocials = true,
    displayItemNumbering = true,
    className,
    // Logo props
    siteName = 'Portfolio',
    siteTitle = 'Developer',
    // Theme props
    dark = false,
    onToggleDark,
    // Colors
    menuButtonColor = '#fff',
    openMenuButtonColor = '#fff',
    changeMenuColorOnOpen = true,
    isFixed = false,
    accentColor = '#5227FF',
    closeOnClickAway = true,
    // Callbacks
    onMenuOpen,
    onMenuClose,
    onItemClick, // New: callback when item is clicked
    navigate // New: navigation function
}) => {
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);

    const panelRef = useRef(null);
    const preLayersRef = useRef(null);
    const preLayerElsRef = useRef([]);

    const plusHRef = useRef(null);
    const plusVRef = useRef(null);
    const iconRef = useRef(null);

    const textInnerRef = useRef(null);
    const textWrapRef = useRef(null);
    const [textLines, setTextLines] = useState(['Menu', 'Close']);

    const openTlRef = useRef(null);
    const closeTweenRef = useRef(null);
    const spinTweenRef = useRef(null);
    const textCycleAnimRef = useRef(null);
    const colorTweenRef = useRef(null);

    const toggleBtnRef = useRef(null);
    const busyRef = useRef(false);

    const itemEntranceTweenRef = useRef(null);
    // Initial GSAP setup - run on mount or when position changes
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;

            const plusH = plusHRef.current;
            const plusV = plusVRef.current;
            const icon = iconRef.current;
            const textInner = textInnerRef.current;

            if (!panel || !plusH || !plusV || !icon || !textInner) return;

            let preLayers = [];
            if (preContainer) {
                preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
            }
            preLayerElsRef.current = preLayers;

            const offscreen = position === 'left' ? -100 : 100;
            gsap.set([panel, ...preLayers], { xPercent: offscreen });

            gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
            gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
            gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

            gsap.set(textInner, { yPercent: 0 });
        });
        return () => ctx.revert();
    }, [position]);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }
        itemEntranceTweenRef.current?.kill();

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        const themeToggle = panel.querySelector('.sm-theme-toggle');

        const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
        const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        if (themeToggle) gsap.set(themeToggle, { opacity: 0, scale: 0.8 });

        const tl = gsap.timeline({ paused: true });

        layerStates.forEach((ls, i) => {
            tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
        const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
        const panelDuration = 0.65;

        tl.fromTo(
            panel,
            { xPercent: panelStart },
            { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
            panelInsertTime
        );

        if (itemEls.length) {
            const itemsStartRatio = 0.15;
            const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

            tl.to(
                itemEls,
                { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
                itemsStart
            );

            if (numberEls.length) {
                tl.to(
                    numberEls,
                    { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity']: 1, stagger: { each: 0.08, from: 'start' } },
                    itemsStart + 0.1
                );
            }
        }

        if (socialTitle || socialLinks.length || themeToggle) {
            const socialsStart = panelInsertTime + panelDuration * 0.4;

            if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
            if (socialLinks.length) {
                tl.to(
                    socialLinks,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.55,
                        ease: 'power3.out',
                        stagger: { each: 0.08, from: 'start' },
                        onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' })
                    },
                    socialsStart + 0.04
                );
            }
            if (themeToggle) {
                tl.to(themeToggle, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, socialsStart + 0.2);
            }
        }

        openTlRef.current = tl;
        return tl;
    }, []);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        if (tl) {
            tl.eventCallback('onComplete', () => {
                busyRef.current = false;
            });
            tl.play(0);
        } else {
            busyRef.current = false;
        }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        openTlRef.current?.kill();
        openTlRef.current = null;
        itemEntranceTweenRef.current?.kill();

        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return;

        const all = [...layers, panel];
        closeTweenRef.current?.kill();

        const offscreen = position === 'left' ? -100 : 100;

        closeTweenRef.current = gsap.to(all, {
            xPercent: offscreen,
            duration: 0.32,
            ease: 'power3.in',
            overwrite: 'auto',
            onComplete: () => {
                const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
                if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

                const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
                if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });

                const socialTitle = panel.querySelector('.sm-socials-title');
                const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
                const themeToggle = panel.querySelector('.sm-theme-toggle');
                if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
                if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
                if (themeToggle) gsap.set(themeToggle, { opacity: 0, scale: 0.8 });

                busyRef.current = false;
            }
        });
    }, [position]);

    const animateIcon = useCallback(opening => {
        const icon = iconRef.current;
        const h = plusHRef.current;
        const v = plusVRef.current;
        if (!icon || !h || !v) return;

        spinTweenRef.current?.kill();

        if (opening) {
            gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
            spinTweenRef.current = gsap
                .timeline({ defaults: { ease: 'power4.out' } })
                .to(h, { rotate: 45, duration: 0.5 }, 0)
                .to(v, { rotate: -45, duration: 0.5 }, 0);
        } else {
            spinTweenRef.current = gsap
                .timeline({ defaults: { ease: 'power3.inOut' } })
                .to(h, { rotate: 0, duration: 0.35 }, 0)
                .to(v, { rotate: 90, duration: 0.35 }, 0)
                .to(icon, { rotate: 0, duration: 0.001 }, 0);
        }
    }, []);

    const animateColor = useCallback(
        opening => {
            const btn = toggleBtnRef.current;
            if (!btn) return;
            colorTweenRef.current?.kill();
            if (changeMenuColorOnOpen) {
                const targetColor = opening ? openMenuButtonColor : menuButtonColor;
                colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
            } else {
                gsap.set(btn, { color: menuButtonColor });
            }
        },
        [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
    );

    React.useEffect(() => {
        if (toggleBtnRef.current) {
            if (changeMenuColorOnOpen) {
                const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
                gsap.set(toggleBtnRef.current, { color: targetColor });
            } else {
                gsap.set(toggleBtnRef.current, { color: menuButtonColor });
            }
        }
    }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

    const animateText = useCallback(opening => {
        const inner = textInnerRef.current;
        if (!inner) return;

        textCycleAnimRef.current?.kill();

        const currentLabel = opening ? 'Menu' : 'Close';
        const targetLabel = opening ? 'Close' : 'Menu';
        const cycles = 3;

        const seq = [currentLabel];
        let last = currentLabel;
        for (let i = 0; i < cycles; i++) {
            last = last === 'Menu' ? 'Close' : 'Menu';
            seq.push(last);
        }
        if (last !== targetLabel) seq.push(targetLabel);
        seq.push(targetLabel);

        setTextLines(seq);
        gsap.set(inner, { yPercent: 0 });

        const lineCount = seq.length;
        const finalShift = ((lineCount - 1) / lineCount) * 100;

        textCycleAnimRef.current = gsap.to(inner, {
            yPercent: -finalShift,
            duration: 0.5 + lineCount * 0.07,
            ease: 'power4.out'
        });
    }, []);

    const toggleMenu = useCallback(() => {
        const target = !openRef.current;
        openRef.current = target;
        setOpen(target);

        if (target) {
            onMenuOpen?.();
            playOpen();
        } else {
            onMenuClose?.();
            playClose();
        }

        animateIcon(target);
        animateColor(target);
        animateText(target);
    }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

    const closeMenu = useCallback(() => {
        if (openRef.current) {
            openRef.current = false;
            setOpen(false);
            onMenuClose?.();
            playClose();
            animateIcon(false);
            animateColor(false);
            animateText(false);
        }
    }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

    // Handle item click - close menu and navigate
    const handleItemClick = useCallback((e, item) => {
        e.preventDefault();
        closeMenu();

        // Small delay to let animation start before navigation
        setTimeout(() => {
            if (onItemClick) {
                onItemClick(item);
            } else if (item.link) {
                if (item.link.startsWith('#')) {
                    // Scroll to section
                    const sectionId = item.link.substring(1);
                    const element = document.getElementById(sectionId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else if (navigate) {
                        // If element not found (e.g. on different page), go to home with hash
                        navigate('/');
                        // Small delay to allow navigation then scroll
                        setTimeout(() => {
                            const el = document.getElementById(sectionId);
                            if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            } else {
                                window.location.hash = item.link;
                            }
                        }, 500);
                    }
                } else if (navigate) {
                    // Use navigate for routes
                    navigate(item.link);
                } else {
                    // Fallback to window location
                    window.location.href = item.link;
                }
            }
        }, 150);
    }, [closeMenu, onItemClick, navigate]);

    React.useEffect(() => {
        if (!closeOnClickAway || !open) return;

        const handleClickOutside = event => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target) &&
                toggleBtnRef.current &&
                !toggleBtnRef.current.contains(event.target)
            ) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeOnClickAway, open, closeMenu]);

    return (
        <div
            className={`sm-scope z-40 ${isFixed ? 'fixed top-0 left-0 w-screen h-screen overflow-hidden' : 'w-full h-full'}`}
        >
            <div
                className={
                    (className ? className + ' ' : '') + 'staggered-menu-wrapper pointer-events-none relative w-full h-full'
                }
                style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
                data-position={position}
                data-open={open || undefined}
            >
                <div
                    ref={preLayersRef}
                    className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
                    aria-hidden="true"
                >
                    {(() => {
                        const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
                        let arr = [...raw];
                        if (arr.length >= 3) {
                            const mid = Math.floor(arr.length / 2);
                            arr.splice(mid, 1);
                        }
                        return arr.map((c, i) => (
                            <div
                                key={i}
                                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                                style={{ background: c }}
                            />
                        ));
                    })()}
                </div>

                <header
                    className="staggered-menu-header absolute top-0 left-0 h-16 flex items-center justify-start px-4 sm:px-6 bg-transparent pointer-events-none z-20"
                    aria-label="Main navigation header"
                >

                    <button
                        ref={toggleBtnRef}
                        className="sm-toggle ml-auto relative inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer text-gray-700 dark:text-gray-200 font-medium leading-none overflow-visible pointer-events-auto"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                        aria-controls="staggered-menu-panel"
                        onClick={toggleMenu}
                        type="button"
                    >
                        <span
                            ref={textWrapRef}
                            className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
                            aria-hidden="true"
                        >
                            <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                                {textLines.map((l, i) => (
                                    <span className="sm-toggle-line block h-[1em] leading-none" key={i}>
                                        {l}
                                    </span>
                                ))}
                            </span>
                        </span>

                        <span
                            ref={iconRef}
                            className="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
                            aria-hidden="true"
                        >
                            <span
                                ref={plusHRef}
                                className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
                            />
                            <span
                                ref={plusVRef}
                                className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
                            />
                        </span>
                    </button>
                </header>

                <aside
                    id="staggered-menu-panel"
                    ref={panelRef}
                    className="staggered-menu-panel absolute top-0 right-0 h-full bg-white/95 dark:bg-gray-900/95 flex flex-col p-[5em_1.5em_1.5em_1.5em] overflow-y-auto z-10 backdrop-blur-[16px] pointer-events-auto"
                    style={{ WebkitBackdropFilter: 'blur(16px)' }}
                    aria-hidden={!open}
                >
                    <div className="sm-panel-inner flex-1 flex flex-col gap-4">
                        <ul
                            className="sm-panel-list list-none m-0 p-0 flex flex-col gap-1"
                            role="list"
                            data-numbering={displayItemNumbering || undefined}
                        >
                            {items && items.length ? (
                                items.map((it, idx) => (
                                    <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                                        <a
                                            className="sm-panel-item relative text-gray-900 dark:text-white font-bold text-[2.5rem] sm:text-[3rem] cursor-pointer leading-none tracking-[-1px] uppercase transition-all duration-200 ease-out inline-block no-underline pr-[1.2em] hover:translate-x-2"
                                            href={it.link}
                                            aria-label={it.ariaLabel}
                                            data-index={idx + 1}
                                            onClick={(e) => handleItemClick(e, it)}
                                        >
                                            <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                                                {it.label}
                                            </span>
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                                    <span className="sm-panel-item relative text-gray-900 dark:text-white font-bold text-[2.5rem] cursor-pointer leading-none tracking-[-1px] uppercase transition-all duration-200 ease-out inline-block no-underline pr-[1.2em]">
                                        <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                                            No items
                                        </span>
                                    </span>
                                </li>
                            )}
                        </ul>

                        {/* Bottom Section: Socials + Theme Toggle */}
                        <div className="mt-auto pt-6 space-y-6">
                            {/* Premium Theme Toggle */}
                            {onToggleDark && (
                                <div className="sm-theme-toggle">
                                    <button
                                        onClick={onToggleDark}
                                        className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full"
                                        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                                    >
                                        {/* Animated Icon Container */}
                                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
                                            {/* Sun/Moon Icons with Rotation */}
                                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${dark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
                                                <FiSun className="text-yellow-300 text-xl" />
                                            </div>
                                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${dark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
                                                <FiMoon className="text-white text-xl" />
                                            </div>
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                                        </div>

                                        {/* Label */}
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                {dark ? 'Light Mode' : 'Dark Mode'}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {dark ? 'Switch to bright theme' : 'Switch to dark theme'}
                                            </span>
                                        </div>

                                        {/* Arrow indicator */}
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {displaySocials && socialItems && socialItems.length > 0 && (
                                <div className="sm-socials flex flex-col gap-3" aria-label="Social links">
                                    <h3 className="sm-socials-title m-0 text-sm font-semibold uppercase tracking-wider [color:var(--sm-accent,#3b82f6)]">
                                        Connect
                                    </h3>
                                    <ul
                                        className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
                                        role="list"
                                    >
                                        {socialItems.map((s, i) => (
                                            <li key={s.label + i} className="sm-socials-item">
                                                <a
                                                    href={s.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="sm-socials-link text-base font-medium text-gray-700 dark:text-gray-300 no-underline relative inline-block py-1 px-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                                                >
                                                    {s.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope .staggered-menu-header { position: absolute; top: 0; right: 0; height: 4rem; display: flex; align-items: center; justify-content: flex-end; padding: 0 1rem; background: transparent; pointer-events: none; z-index: 20; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.3rem; background: transparent; border: none; cursor: pointer; color: #e9e9ef; font-weight: 500; line-height: 1; overflow: visible; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid var(--sm-accent, #3b82f6); outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
.sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: clamp(280px, 85vw, 400px); height: 100%; display: flex; flex-direction: column; overflow-y: auto; z-index: 10; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(280px, 85vw, 400px); pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
.sm-scope .sm-socials { display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 0.875rem; font-weight: 600; color: var(--sm-accent, #3b82f6); }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: all 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.5; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.25rem; }
.sm-scope .sm-panel-item { position: relative; font-weight: 700; font-size: 2.5rem; cursor: pointer; line-height: 1.1; letter-spacing: -1px; text-transform: uppercase; transition: all 0.2s ease; display: inline-block; text-decoration: none; padding-right: 1.2em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, #3b82f6); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.2em; right: 0; font-size: 14px; font-weight: 400; color: var(--sm-accent, #3b82f6); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
@media (max-width: 640px) { 
    .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } 
    .sm-scope .sm-prelayers { width: 100%; }
    .sm-scope .sm-panel-item { font-size: 2rem; }
}
            `}</style>
        </div>
    );
};

export default StaggeredMenu;
