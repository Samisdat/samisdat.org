'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Zentrale Registry für alle in MDX nutzbaren Demo-Komponenten.
 *
 * Jede Demo wird hier einmal registriert und automatisch:
 * - als dynamic Next.js-Import mit SSR-Policy exportiert
 * - im MDX-Component-Mapping verfügbar gemacht
 *
 * SSR-Policy: Alle Demos verwenden `ssr: true`, da sie seit der letzten
 * Umstellung SSR-fähig sind. Dies gewährleistet konsistentes Hydration-
 * und Performance-Verhalten.
 *
 * @see REPORT-12-MDX-REGISTRY.md
 */

/**
 * Registry-Eintrag: Import-Pfad für jede Demo-Komponente.
 */
const demoRegistry = {
    DemoAnimationsCompare: () =>
        import('@samisdat/ui-components/Demo/Animations/Compare').then(mod => ({ default: mod.DemoAnimationsCompare })),
    DemoAnimationsSvg: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsSvg').then(mod => ({
            default: mod.DemoAnimationsSvg,
        })),
    DemoAnimationsCssJs: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsCssJs').then(mod => ({
            default: mod.DemoAnimationsCssJs,
        })),
    DemoAnimationsJsAttributes: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsJsAttributes').then(mod => ({
            default: mod.DemoAnimationsJsAttributes,
        })),
    DemoAnimationsMorphThumb: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsMorphThumb').then(mod => ({
            default: mod.DemoAnimationsMorphThumb,
        })),
    DemoAnimationsMorphHills: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsMorphHills').then(mod => ({
            default: mod.DemoAnimationsMorphHills,
        })),
    DemoAnimationsMorphCoffee: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsMorphCoffee').then(mod => ({
            default: mod.DemoAnimationsMorphCoffee,
        })),
    DemoAnimationsMorphGood: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsMorphGood').then(mod => ({
            default: mod.DemoAnimationsMorphGood,
        })),
    DemoAnimationsMorphHeart: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsMorphHeart').then(mod => ({
            default: mod.DemoAnimationsMorphHeart,
        })),
    DemoAnimationsDisc: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsDisc').then(mod => ({
            default: mod.DemoAnimationsDisc,
        })),
    DemoAnimationsCrank: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsCrank').then(mod => ({
            default: mod.DemoAnimationsCrank,
        })),
    DemoParallaxSectors: () =>
        import('@samisdat/ui-components/Demo/Parallax/Sectors').then(mod => ({ default: mod.DemoParallaxSectors })),
    DemoParallaxHills: () =>
        import('@samisdat/ui-components/Demo/Parallax/Hills').then(mod => ({ default: mod.DemoParallaxHills })),
    DemoParallaxCircles: () =>
        import('@samisdat/ui-components/Demo/Parallax/Circles').then(mod => ({ default: mod.DemoParallaxCircles })),
} as const satisfies Record<string, () => Promise<{ default: ComponentType<any> }>>;

/**
 * Typsichere Demo-Komponenten-Namen.
 */
export type DemoComponentName = keyof typeof demoRegistry;

/**
 * Generiert dynamisch geladene Demo-Komponenten aus der zentralen Registry.
 * Alle Demos verwenden `ssr: true` für konsistentes Hydration-Verhalten.
 */
const createDynamicDemos = () => {
    const entries = Object.entries(demoRegistry) as [DemoComponentName, (typeof demoRegistry)[DemoComponentName]][];

    return entries.reduce(
        (acc, [name, loader]) => {
            acc[name] = dynamic(loader, { ssr: true }) as ComponentType<any>;
            return acc;
        },
        {} as Record<DemoComponentName, ComponentType<any>>
    );
};

export const demos = createDynamicDemos();

// Named Exports für direkte Nutzung und Abwärtskompatibilität
export const DemoAnimationsCompare = demos.DemoAnimationsCompare;
export const DemoAnimationsSvg = demos.DemoAnimationsSvg;
export const DemoAnimationsCssJs = demos.DemoAnimationsCssJs;
export const DemoAnimationsJsAttributes = demos.DemoAnimationsJsAttributes;
export const DemoAnimationsMorphThumb = demos.DemoAnimationsMorphThumb;
export const DemoAnimationsMorphHills = demos.DemoAnimationsMorphHills;
export const DemoAnimationsMorphCoffee = demos.DemoAnimationsMorphCoffee;
export const DemoAnimationsMorphGood = demos.DemoAnimationsMorphGood;
export const DemoAnimationsMorphHeart = demos.DemoAnimationsMorphHeart;
export const DemoAnimationsDisc = demos.DemoAnimationsDisc;
export const DemoAnimationsCrank = demos.DemoAnimationsCrank;
export const DemoParallaxSectors = demos.DemoParallaxSectors;
export const DemoParallaxHills = demos.DemoParallaxHills;
export const DemoParallaxCircles = demos.DemoParallaxCircles;
