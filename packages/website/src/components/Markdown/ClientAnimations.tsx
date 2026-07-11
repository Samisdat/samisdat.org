'use client';

import dynamic from 'next/dynamic';

export const DemoAnimationsCompare = dynamic(
    () => import('../Demo/Animations/Compare').then(mod => ({ default: mod.DemoAnimationsCompare })),
    { ssr: true }
);

export const DemoAnimationsSvg = dynamic(
    () => import('../Demo/Animations/DemoAnimationsSvg').then(mod => ({ default: mod.DemoAnimationsSvg })),
    { ssr: true }
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
    { ssr: true }
);
export const DemoAnimationsMorphThumb = dynamic(
    () =>
        import('../Demo/Animations/DemoAnimationsMorphThumb').then(mod => ({ default: mod.DemoAnimationsMorphThumb })),
    { ssr: true }
);
export const DemoAnimationsMorphUgly = dynamic(
    () => import('../Demo/Animations/DemoAnimationsMorphUgly').then(mod => ({ default: mod.DemoAnimationsMorphUgly })),
    { ssr: true }
);
export const DemoAnimationsMorphCoffee = dynamic(
    () =>
        import('../Demo/Animations/DemoAnimationsMorphCoffee').then(mod => ({
            default: mod.DemoAnimationsMorphCoffee,
        })),
    { ssr: true }
);
export const DemoParallaxSectors = dynamic(
    () => import('../Demo/Parallax/Sectors').then(mod => ({ default: mod.DemoParallaxSectors })),
    { ssr: true }
);
export const DemoParallaxHills = dynamic(
    () => import('../Demo/Parallax/Hills').then(mod => ({ default: mod.DemoParallaxHills })),
    { ssr: true }
);
export const DemoParallaxCircles = dynamic(
    () => import('../Demo/Parallax/Circles').then(mod => ({ default: mod.DemoParallaxCircles })),
    { ssr: true }
);
