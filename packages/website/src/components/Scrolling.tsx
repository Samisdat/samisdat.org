'use client';

import { useAnimationFrame } from '@/hooks/useAnimationFrame';
import { FC, HTMLAttributes, useEffect, useRef } from 'react';

export const Scrolling: FC<HTMLAttributes<HTMLDivElement>> = () => {
    const ref = useRef<number>(0);

    const updateMix = () => {
        document.documentElement.style.setProperty(
            '--mix',
            String(Math.min(100, Math.max(0, window.pageYOffset - ref.current / 2)) / 100)
        );
    };
    useAnimationFrame(updateMix);

    useEffect(() => {
        if (!window) {
            return;
        }

        const update = () => {
            ref.current = document.querySelector('.panorama')?.getBoundingClientRect().height || 0;
        };

        update(); // initial
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return null;
};
