'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { LAT, LNG } from '@/lib/location';
import { canEnterWindow, starPositions, type Star } from '@/lib/stars';
import { useTal } from '@/lib/TalContext';

import { FLASH_MAGNITUDE, flashStyle, RADIUS, starOpacity, starRadius, starShows, starTint } from './starStyle';

/** Where the sky window sits in the 1700 x 500 viewBox. Calibrated by eye against the hills. */
const SKY = { left: 0, width: 1700, horizonY: 250, topY: 10 };
/** Smallest on-screen radius in CSS pixels. Below this size all radii are scaled up together, so stars do not vanish on small screens. */
const MIN_RADIUS_PX = 0.3;
/** Skip DOM writes for moves smaller than this (viewBox units); real-time movement is tiny. */
const EPSILON = 0.05;

interface StarDotsProps {
    stars: readonly Star[];
    /** Factor applied to every radius, 1 unless the panorama is scaled down a lot. */
    boost: number;
}

/** Rendered once per catalogue; positions are written imperatively afterwards. */
const StarDots = memo(({ stars, boost }: StarDotsProps) => (
    <>
        {stars.map(([, , mag, ci], index) => {
            const flash = mag < FLASH_MAGNITUDE;

            return (
                <circle
                    // The catalogue is static and sorted, the index is the identity.
                    // oxlint-disable-next-line react/no-array-index-key
                    key={index}
                    r={(starRadius(mag) * boost).toFixed(2)}
                    fill={flash ? '#fff' : starTint(ci)}
                    opacity={starOpacity(mag).toFixed(2)}
                    visibility="hidden"
                    className={flash ? 'star-flash' : undefined}
                    style={flash ? flashStyle(index) : undefined}
                />
            );
        })}
    </>
));
StarDots.displayName = 'StarDots';

interface StarsProps {
    stars: readonly Star[];
    /** 0..1, how dark the sky is, see skyPalette. */
    amount: number;
    /** 0..1, how many stars show besides the brightest few, see skyPalette. */
    reveal: number;
}

/** Writes the stars of the window into the circles; at dusk only the bright ones show. */
const placeStars = (
    stars: readonly Star[],
    circles: HTMLCollection,
    buffer: Float32Array,
    written: Float32Array,
    reveal: number
) => {
    let rank = 0;

    for (let i = 0; i < buffer.length / 2; i++) {
        const circle = circles[i];
        const u = buffer[i * 2];
        const v = buffer[i * 2 + 1];
        const wasShown = !Number.isNaN(written[i * 2]);
        const shows = !Number.isNaN(u) && starShows(rank, stars[i][2], reveal);

        if (!Number.isNaN(u)) rank += 1;

        if (!shows) {
            if (wasShown) {
                circle.setAttribute('visibility', 'hidden');
                written[i * 2] = NaN;
            }
            continue;
        }

        const x = SKY.left + u * SKY.width;
        const y = SKY.horizonY - v * (SKY.horizonY - SKY.topY);

        if (wasShown && Math.abs(x - written[i * 2]) < EPSILON && Math.abs(y - written[i * 2 + 1]) < EPSILON) {
            continue;
        }

        circle.setAttribute('cx', x.toFixed(2));
        circle.setAttribute('cy', y.toFixed(2));
        if (!wasShown) circle.setAttribute('visibility', 'visible');
        written[i * 2] = x;
        written[i * 2 + 1] = y;
    }
};

export const Stars = ({ stars, amount, reveal }: StarsProps) => {
    const { time } = useTal();
    const groupRef = useRef<SVGGElement>(null);
    const [boost, setBoost] = useState(1);

    // Only stars that can ever enter the window get a circle.
    const candidates = useMemo(() => stars.filter(([, dec]) => canEnterWindow(dec, LAT)), [stars]);
    // Window coordinates, and last written x, y per star (NaN while hidden).
    const buffers = useRef<{ buffer: Float32Array; written: Float32Array } | null>(null);

    const visible = amount > 0;

    // Screen pixels per viewBox unit changes with the panorama width.
    useEffect(() => {
        const svg = groupRef.current?.ownerSVGElement;
        if (!svg) return;

        const update = () => {
            const scale = svg.getBoundingClientRect().width / SKY.width;
            setBoost(scale > 0 ? Math.max(1, MIN_RADIUS_PX / scale / RADIUS.min) : 1);
        };
        update();

        const observer = new ResizeObserver(update);
        observer.observe(svg);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const group = groupRef.current;
        if (!group || !visible) return;

        if (buffers.current?.buffer.length !== candidates.length * 2) {
            buffers.current = {
                buffer: new Float32Array(candidates.length * 2),
                written: new Float32Array(candidates.length * 2).fill(NaN),
            };
        }
        const { buffer, written } = buffers.current;

        starPositions(candidates, time, LAT, LNG, buffer);

        placeStars(candidates, group.children, buffer, written, reveal);
    }, [time, visible, candidates, reveal]);

    return (
        <g
            ref={groupRef}
            id="stars"
            opacity={amount}
            suppressHydrationWarning
        >
            <StarDots
                stars={candidates}
                boost={boost}
            />
        </g>
    );
};
