'use client';

import { ThemeName, ThemeSwitcher as ThemeSwitcherUi } from '@samisdat/ui-components/ThemeSwitcher';

import { useMediaQuery } from '@samisdat/tools';
import { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
    const prefers: ThemeName = useMediaQuery(`(prefers-color-scheme: light)`, false) ? 'light' : 'dark';

    const [theme, setTheme] = useState<ThemeName>(() => {
        if (typeof window === 'undefined') {
            return 'dark';
        }

        const sessionTheme = sessionStorage.getItem('theme');

        if (!sessionTheme) {
            return prefers;
        }

        if ('light' === sessionTheme) {
            return 'light';
        }
        return 'dark';
    });

    useEffect(() => {
        if (theme === prefers) {
            sessionStorage.removeItem('theme');
            return;
        }
        sessionStorage.setItem('theme', theme);
    }, [theme, prefers]);

    useEffect(() => {
        const root = document.documentElement;

        if (prefers === 'light' && 'light' === theme) {
            root.removeAttribute('data-theme');
            return;
        } else if (prefers === 'dark' && 'dark' === theme) {
            root.removeAttribute('data-theme');
            return;
        } else {
            root.setAttribute('data-theme', theme);
        }
    }, [theme, prefers]);

    return (
        <>
            <ThemeSwitcherUi
                theme={theme}
                onUpdate={setTheme}
            />
        </>
    );
};
