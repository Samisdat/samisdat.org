'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import { ThemeSwitcher } from './ThemeSwitcher';

let panoramaIntersecting = true;

const subscribePanorama = (onChange: () => void) => {
    const panorama = document.querySelector('.panorama');
    if (!panorama) return () => {};

    const observer = new IntersectionObserver(
        ([entry]) => {
            panoramaIntersecting = entry.isIntersecting;
            onChange();
        },
        // Viewport-Oberkante um 20px erweitern: Panorama gilt 20px länger
        // als sichtbar, der Switcher blendet entsprechend 20px später ein.
        { rootMargin: '20px 0px 0px 0px' }
    );

    observer.observe(panorama);
    return () => observer.disconnect();
};

// Ohne Panorama auf der Seite ist der Switcher immer sichtbar.
const getPanoramaVisible = () => document.querySelector('.panorama') !== null && panoramaIntersecting;

/**
 * Blendet den ThemeSwitcher aus, solange das Panorama (`.panorama`) sichtbar
 * ist: Der Theme-Umschalter ist dort redundant (das Panorama zeigt den
 * Theme-Wechsel bereits selbst) und würde unnötig fokussierbar bleiben.
 */
export const ThemeSwitcherSlot = () => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const panoramaVisible = useSyncExternalStore(
        subscribePanorama,
        getPanoramaVisible,
        // Server/Hydration: Panorama gilt als sichtbar, wie bisher der Startwert.
        () => true
    );

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        if (panoramaVisible && wrapper.contains(document.activeElement)) {
            document.body.focus();
        }
    }, [panoramaVisible]);

    return (
        <div
            ref={wrapperRef}
            inert={panoramaVisible}
            style={{
                opacity: panoramaVisible ? 0 : 1,
                transition: 'opacity 320ms ease',
            }}
        >
            <ThemeSwitcher />
        </div>
    );
};
