'use client';

import dynamic from 'next/dynamic';

export const DemoAnimationsCompare = dynamic(
    () => import('../Demo/Animations/Compare').then(mod => ({ default: mod.DemoAnimationsCompare })),
    { ssr: false }
);

export const DemoAnimationsSvg = dynamic(
    () => import('../Demo/Animations/DemoAnimationsSvg').then(mod => ({ default: mod.DemoAnimationsSvg })),
    { ssr: false }
);

export const DemoAnimationsCss = dynamic(
    () => import('../Demo/Animations/DemoAnimationsCss').then(mod => ({ default: mod.DemoAnimationsCss })),
    {
        ssr: false,
    }
);

export const DemoAnimationsCssJs = dynamic(
    () => import('../Demo/Animations/DemoAnimationsCssJs').then(mod => ({ default: mod.DemoAnimationsCssJs })),
    {
        ssr: false,
    }
);

export const DemoAnimationsJsAttributes = dynamic(
    () =>
        import('../Demo/Animations/DemoAnimationsJsAttributes').then(mod => ({
            default: mod.DemoAnimationsJsAttributes,
        })),
    { ssr: false }
);
export const DemoAnimationsMorph = dynamic(
    () => import('../Demo/Animations/DemoAnimationsMorph').then(mod => ({ default: mod.DemoAnimationsMorph })),
    { ssr: false }
);
export const DemoParallaxSectors = dynamic(
    () => import('../Demo/Parallax/Sectors').then(mod => ({ default: mod.DemoParallaxSectors })),
    { ssr: true }
);
export const DemoParallaxHills = dynamic(
    () => import('../Demo/Parallax/Hills').then(mod => ({ default: mod.DemoParallaxHills })),
    { ssr: true }
);
