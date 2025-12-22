'use client';
import { useEffect, useState } from 'react';

type ColorTheme = 'system' | 'light' | 'dark';

export const ColorSwitcher = () => {
    const [theme, setTheme] = useState<ColorTheme>(() => {
        if (typeof window === 'undefined') return 'system';
        return (localStorage.getItem('theme') as ColorTheme) ?? 'system';
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'system') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <>
            <label>
                <input
                    type={'radio'}
                    value={'system'}
                    checked={theme === 'system'}
                    onChange={() => {
                        setTheme('system');
                    }}
                />
                System
            </label>
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
