'use client';
import { useMediaQuery } from '@samisdat/tools';
import { ThemeName, ThemeSwitcher as ThemeSwitcherUi } from '@samisdat/ui-components/ThemeSwitcher';
import { useEffect, useSyncExternalStore } from 'react';

const subscribeToSessionStorage = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    // sessionStorage hat kein change event, aber wir können storage event nutzen
    // (funktioniert nur cross-tab, aber für unseren Use-Case reicht das)
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
};

const getSessionTheme = (): ThemeName | null => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('theme');
    return stored === 'light' || stored === 'dark' ? stored : null;
};

export const ThemeSwitcher = () => {
    const prefers: ThemeName = useMediaQuery(`(prefers-color-scheme: light)`, false) ? 'light' : 'dark';

    // Subscribe to sessionStorage (though it won't update often in same tab)
    const sessionTheme = useSyncExternalStore(
        subscribeToSessionStorage,
        getSessionTheme,
        () => null // SSR snapshot
    );

    // Resolve theme: sessionStorage > prefers-color-scheme
    const resolvedTheme = sessionTheme ?? prefers;

    useEffect(() => {
        // Sync theme to DOM
        const root = document.documentElement;
        if (prefers === resolvedTheme) {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', resolvedTheme);
        }
    }, [resolvedTheme, prefers]);

    const handleThemeUpdate = (newTheme: ThemeName) => {
        if (newTheme === prefers) {
            sessionStorage.removeItem('theme');
        } else {
            sessionStorage.setItem('theme', newTheme);
        }
        // Trigger re-render by dispatching storage event manually
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <ThemeSwitcherUi
            theme={resolvedTheme}
            onUpdate={handleThemeUpdate}
        />
    );
};
