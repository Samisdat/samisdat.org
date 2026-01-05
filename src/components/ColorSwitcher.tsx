'use client';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useEffect, useState } from 'react';

type ColorTheme = 'light' | 'dark';

export const ColorSwitcher = () => {
    const prefersLight = useMediaQuery(`(prefers-color-scheme: light)`, false);

    const [theme, setTheme] = useState<ColorTheme>(() => {
        if (typeof window === 'undefined') return 'dark';
        return ((sessionStorage.getItem('theme') as ColorTheme) ?? prefersLight) ? 'light' : 'dark';
    });

    useEffect(() => {

        const root = document.documentElement;

        if (prefersLight && 'light' === theme) {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }

        sessionStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <>
            <label></label>
            <label>
                <input
                    type={'radio'}
                    value={'system'}
                    checked={theme === 'light'}
                    onChange={() => {
                        setTheme('light');
                    }}
                />
                Light
            </label>
            <label>
                <input
                    type={'radio'}
                    value={'system'}
                    checked={theme === 'dark'}
                    onChange={() => {
                        setTheme('dark');
                    }}
                />
                Dark
            </label>
        </>
    );
};
