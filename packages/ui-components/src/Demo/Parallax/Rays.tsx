'use client';

import { styled } from '@linaria/react';
import { useEffect, useId, useState } from 'react';

import { usePrefersReducedMotion } from '@samisdat/tools';

import { MapView } from './rays/MapView';
import { createRaysState, useRaysClock } from './rays/state';
import { WindowView } from './rays/WindowView';

/* Semantic tokens only; the demo is dark by design (force-theme-dark). */
const Styling = styled.section`
    display: grid;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: var(--color-surface-raised);
    color: var(--color-text-default);

    & svg {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 0.5rem;
    }

    & .map-bg,
    & .sky {
        fill: var(--color-surface-emphasis);
    }
    & .ground {
        fill: var(--color-surface-subtle);
    }
    & .horizon,
    & .rail line {
        stroke: var(--color-border-muted);
    }
    & .frame {
        fill: none;
        stroke: var(--color-border-default);
        stroke-width: 4;
    }
    & .axis,
    & .cone {
        stroke: var(--color-ink-turquoise);
        stroke-dasharray: 5 5;
    }
    & .axis {
        stroke-opacity: 0.6;
    }
    & .cone {
        fill: var(--color-ink-turquoise);
        fill-opacity: 0.07;
        stroke-opacity: 0.5;
    }
    & .contour {
        fill: none;
        stroke: var(--color-ink-amethyst);
        stroke-opacity: 0.3;
    }
    & .contour.index {
        stroke-opacity: 0.6;
        stroke-width: 1.5;
    }
    & .rail line {
        stroke-width: 1.5;
    }
    & .train rect {
        fill: var(--color-ink-turquoise);
    }
    & .train circle {
        fill: var(--color-ink-gold);
    }

    & .k-tree .wedge,
    & .k-tree circle,
    & .crown {
        fill: var(--color-ink-jade);
    }
    & .k-house .wedge,
    & .house-mark rect,
    & .wall {
        fill: var(--color-ink-lapis);
    }
    & .k-hill .wedge,
    & .hill-mark {
        fill: var(--color-ink-amethyst);
    }
    & .wedge {
        fill-opacity: 0.5;
    }
    & .ray {
        stroke-width: 1.5;
        stroke-opacity: 0.7;
    }
    & .k-tree .ray {
        stroke: var(--color-ink-jade);
    }
    & .k-house .ray,
    & .house-mark line {
        stroke: var(--color-ink-lapis);
    }
    & .k-hill .ray {
        stroke: var(--color-ink-amethyst);
    }
    & .trunk {
        fill: var(--color-ink-copper);
    }
    & .roof {
        fill: var(--color-ink-steel);
    }
    & .opening {
        fill: var(--color-surface-emphasis);
    }
    & .ridge {
        fill: var(--color-ink-amethyst);
    }
    & .ridge.far {
        fill-opacity: 0.4;
    }
    & .ridge.near {
        fill-opacity: 0.75;
    }
`;

const Legend = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 0.8rem;

    & li {
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    & i {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background: var(--dot);
    }
`;

const Toggle = styled.button`
    justify-self: start;
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--color-border-default);
    border-radius: 0.5rem;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;

    &:focus-visible {
        outline: 2px solid var(--color-border-focus);
        outline-offset: 2px;
    }
`;

const LEGEND = [
    ['Zug', 'turquoise'],
    ['Auge', 'gold'],
    ['Bäume', 'jade'],
    ['Haus', 'lapis'],
    ['Hügel', 'amethyst'],
] as const;

/**
 * Train passing trees, a house and hills: top-down map with sight rays and the angle each ray swept in the
 * last half second, and below it the window view of the same scene.
 */
export const DemoParallaxRays = () => {
    const reduced = usePrefersReducedMotion();
    const ids = [useId(), useId()];
    const [state] = useState(() => createRaysState(false));
    // null until the reader decides; reduced motion starts paused, the toggle still lets the reader play
    const [choice, setChoice] = useState<boolean | null>(null);
    const playing = choice ?? !reduced;

    useRaysClock(state);
    useEffect(() => {
        state.setPlaying(playing);
    }, [playing, state]);

    const toggle = () => setChoice(!playing);

    return (
        <Styling className="force-theme-dark">
            <Legend aria-label="Legende">
                {LEGEND.map(([label, ink]) => (
                    <li key={label}>
                        <i style={{ '--dot': `var(--color-ink-${ink})` } as React.CSSProperties} />
                        {label}
                    </li>
                ))}
            </Legend>
            <MapView state={state} titleId={ids[0]} />
            <WindowView state={state} titleId={ids[1]} />
            {reduced && <p>Die Animation startet pausiert, weil du weniger Bewegung bevorzugst.</p>}
            <Toggle type="button" onClick={toggle} aria-pressed={!playing}>
                {playing ? 'Pause' : 'Abspielen'}
            </Toggle>
        </Styling>
    );
};
