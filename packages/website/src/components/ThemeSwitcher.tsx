'use client';
import { useMediaQuery } from '@samisdat/tools';
import { ThemeName, ThemeSwitcher as ThemeSwitcherUi } from '@samisdat/ui-components/ThemeSwitcher';
import { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
    const prefers: ThemeName = useMediaQuery(`(prefers-color-scheme: light)`, false) ? 'light' : 'dark';
    const [theme, setTheme] = useState<ThemeName>('dark');
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const sessionTheme = sessionStorage.getItem('theme');
        const resolved: ThemeName = sessionTheme === 'light' ? 'light' : sessionTheme === 'dark' ? 'dark' : prefers;
        setTheme(resolved);
        setHydrated(true);
    }, [prefers]);

    useEffect(() => {
        if (!hydrated) return;
        if (theme === prefers) {
            sessionStorage.removeItem('theme');
            return;
        }
        sessionStorage.setItem('theme', theme);
    }, [theme, prefers, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        const root = document.documentElement;
        if (prefers === theme) {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }
    }, [theme, prefers, hydrated]);

    return (
        <ThemeSwitcherUi
            theme={theme}
            onUpdate={setTheme}
        />
    );
};
