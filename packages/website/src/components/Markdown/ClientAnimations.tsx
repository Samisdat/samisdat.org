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

type DemoLoader = () => Promise<{ default: ComponentType<any> }>;

/**
 * Registry-Eintrag: Import-Pfad für jede Demo-Komponente.
 */
const demoRegistry = {
    // smil demo
    DemoSmilDisc: () =>
        import('@samisdat/ui-components/Demo/Smil/Disc').then(mod => ({
            default: mod.DemoSmilDisc,
        })),
    DemoSmilMorphMistakes: () =>
        import('@samisdat/ui-components/Demo/Smil/MorphMistakes').then(mod => ({
            default: mod.DemoSmilMorphMistakes,
        })),
    DemoSmilSchwebebahn: () =>
        import('@samisdat/ui-components/Demo/Smil/Schwebebahn').then(mod => ({
            default: mod.DemoSmilSchwebebahn,
        })),
    DemoSmilMorphIcons: () =>
        import('@samisdat/ui-components/Demo/Smil/MorphIcons').then(mod => ({
            default: mod.DemoSmilMorphIcons,
        })),
    DemoSmilMorphHills: () =>
        import('@samisdat/ui-components/Demo/Smil/MorphHills').then(mod => ({
            default: mod.DemoSmilMorphHills,
        })),
    DemoSmilCrank: () =>
        import('@samisdat/ui-components/Demo/Smil/Crank').then(mod => ({
            default: mod.DemoSmilCrank,
        })),
    DemoSmilCrankFormula: () =>
        import('@samisdat/ui-components/Demo/Smil/Crank').then(mod => ({
            default: mod.DemoSmilCrankFormula,
        })),

    DemoAnimationsCompare: () =>
        import('@samisdat/ui-components/Demo/Animations/Compare').then(mod => ({ default: mod.DemoAnimationsCompare })),
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
    DemoAnimationsMorphCoffee: () =>
        import('@samisdat/ui-components/Demo/Animations/DemoAnimationsMorphCoffee').then(mod => ({
            default: mod.DemoAnimationsMorphCoffee,
        })),
    DemoParallaxSectors: () =>
        import('@samisdat/ui-components/Demo/Parallax/Sectors').then(mod => ({ default: mod.DemoParallaxSectors })),
    DemoParallaxHills: () =>
        import('@samisdat/ui-components/Demo/Parallax/Hills').then(mod => ({ default: mod.DemoParallaxHills })),
    DemoGhostSectors: () =>
        import('@samisdat/ui-components/Demo/Parallax/GhostSectors').then(mod => ({ default: mod.DemoGhostSectors })),
    DemoGhostCircles: () =>
        import('@samisdat/ui-components/Demo/Parallax/GhostCircles').then(mod => ({ default: mod.DemoGhostCircles })),
    DemoGhostHills: () =>
        import('@samisdat/ui-components/Demo/Parallax/GhostHills').then(mod => ({ default: mod.DemoGhostHills })),
    DemoGhostRecorder: () =>
        import('@samisdat/ui-components/Demo/Parallax/GhostRecorderDemo').then(mod => ({
            default: mod.DemoGhostRecorder,
        })),
    DemoParallaxRays: () =>
        import('@samisdat/ui-components/Demo/Parallax/Rays').then(mod => ({ default: mod.DemoParallaxRays })),
    DemoParallaxCircles: () =>
        import('@samisdat/ui-components/Demo/Parallax/Circles').then(mod => ({ default: mod.DemoParallaxCircles })),
    DemoParallaxCirclesScroll: () =>
        import('@samisdat/ui-components/Demo/Parallax/CirclesScroll').then(mod => ({
            default: mod.DemoParallaxCirclesScroll,
        })),
    DemoParallaxHillsHybrid: () =>
        import('@samisdat/ui-components/Demo/Parallax/HillsHybrid').then(mod => ({
            default: mod.DemoParallaxHillsHybrid,
        })),
    DemoParallaxHillsScroll: () =>
        import('@samisdat/ui-components/Demo/Parallax/HillsScroll').then(mod => ({
            default: mod.DemoParallaxHillsScroll,
        })),
    DemoParallaxScroll: () =>
        import('@samisdat/ui-components/Demo/Parallax/Scroll').then(mod => ({ default: mod.DemoParallaxScroll })),
} as const satisfies Record<string, DemoLoader>;

/**
 * Typsichere Demo-Komponenten-Namen.
 */
export type DemoComponentName = keyof typeof demoRegistry;

/**
 * Generiert dynamisch geladene Demo-Komponenten aus der zentralen Registry.
 * Alle Demos verwenden `ssr: true` für konsistentes Hydration-Verhalten.
 */
const createDynamicDemos = () => {
    const entries = Object.entries(demoRegistry) as [DemoComponentName, DemoLoader][];

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
export const DemoSmilDisc = demos.DemoSmilDisc;
export const DemoSmilMorphMistakes = demos.DemoSmilMorphMistakes;
export const DemoSmilSchwebebahn = demos.DemoSmilSchwebebahn;
export const DemoSmilMorphIcons = demos.DemoSmilMorphIcons;
export const DemoSmilMorphHills = demos.DemoSmilMorphHills;
export const DemoSmilCrank = demos.DemoSmilCrank;
export const DemoSmilCrankFormula = demos.DemoSmilCrankFormula;

export const DemoAnimationsCompare = demos.DemoAnimationsCompare;
export const DemoAnimationsCssJs = demos.DemoAnimationsCssJs;
export const DemoAnimationsJsAttributes = demos.DemoAnimationsJsAttributes;
export const DemoAnimationsMorphThumb = demos.DemoAnimationsMorphThumb;
export const DemoAnimationsMorphCoffee = demos.DemoAnimationsMorphCoffee;
export const DemoParallaxSectors = demos.DemoParallaxSectors;
export const DemoParallaxHills = demos.DemoParallaxHills;
export const DemoGhostSectors = demos.DemoGhostSectors;
export const DemoGhostCircles = demos.DemoGhostCircles;
export const DemoGhostHills = demos.DemoGhostHills;
export const DemoGhostRecorder = demos.DemoGhostRecorder;
export const DemoParallaxRays = demos.DemoParallaxRays;
export const DemoParallaxCircles = demos.DemoParallaxCircles;
export const DemoParallaxCirclesScroll = demos.DemoParallaxCirclesScroll;
export const DemoParallaxHillsHybrid = demos.DemoParallaxHillsHybrid;
export const DemoParallaxHillsScroll = demos.DemoParallaxHillsScroll;
export const DemoParallaxScroll = demos.DemoParallaxScroll;
