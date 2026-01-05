'use client';

import dynamic from 'next/dynamic';

export const DemoAnimationsCompare = dynamic(
    () => import('../Demo/Animations/Compare').then(mod => ({ default: mod.DemoAnimationsCompare })),
    { ssr: false }
);

export const SvgAnimate = dynamic(
    () => import('../Demo/Animations/SvgAnimate').then(mod => ({ default: mod.SvgAnimate })),
    { ssr: false }
);

export const SvgCss = dynamic(() => import('../Demo/Animations/SvgCss').then(mod => ({ default: mod.SvgCss })), {
    ssr: false,
});

export const SvgPathWithJs = dynamic(
    () => import('../Demo/Animations/SvgPathWithJs').then(mod => ({ default: mod.SvgPathWithJs })),
    { ssr: false }
);
