import { useId } from 'react';

import { F, HILLS, HOR, layerPath, NORM_MID, OBJECTS, WH } from './scene';

import type { SceneObject } from './scene';
import type { CSSProperties } from 'react';

/** Everything with a sprite, far to near, so that nearer things cover farther ones. */
export const SPRITES = OBJECTS.filter(o => o.k !== 'hill').sort((a, b) => b.d - a.d);

export const Sprite = ({ o }: { o: SceneObject }) =>
    o.k === 'tree' ? (
        <>
            <rect
                className="trunk"
                x={-0.7}
                y={-6}
                width={1.4}
                height={6}
            />
            <circle
                className="crown"
                cx={0}
                cy={-9.5}
                r={4.5}
            />
        </>
    ) : (
        <>
            <rect
                className="wall"
                x={-12}
                y={-9}
                width={24}
                height={9}
            />
            <path
                className="roof"
                d="M-14,-9L0,-17L14,-9Z"
            />
            <rect
                className="opening"
                x={-2}
                y={-5}
                width={4}
                height={5}
            />
            <rect
                className="opening"
                x={-9}
                y={-6.5}
                width={4}
                height={3}
            />
            <rect
                className="opening"
                x={5}
                y={-6.5}
                width={4}
                height={3}
            />
        </>
    );

/** Clips the scene to the rounded frame, so that the square corners of sky and ground do not poke out. */
export const FrameClip = ({ id }: { id: string }) => (
    <clipPath id={id}>
        <rect
            x={1}
            y={1}
            width={798}
            height={WH - 2}
            rx={14}
        />
    </clipPath>
);

/** Day sky of the panorama: blue on top, light blue towards the horizon. */
export const SkyGradient = ({ id }: { id: string }) => (
    <defs>
        <linearGradient
            id={id}
            x1={0}
            y1={0}
            x2={0}
            y2={1}
        >
            <stop
                offset="10%"
                className="sky-top"
            />
            <stop
                offset="60%"
                className="sky-low"
            />
        </linearGradient>
    </defs>
);

/** Far to near, so that the nearer hill covers the farther one. */
export const LAYERS = [...HILLS].sort((a, b) => b.d - a.d);

/** Shift inputs of a layer or sprite; the CSS ride turns them into the position, see `rideStyle`. */
const shiftVars = (d: number, s: number, extra: Record<string, string> = {}) =>
    ({ '--k': String(F / d), '--ds': String(s - NORM_MID), ...extra }) as CSSProperties;

/**
 * The window view. It has no script: layers and sprites read the custom property of the ride, so they move
 * only when the CSS animation of the surrounding demo runs.
 */
export const WindowView = ({ titleId, panorama = false }: { titleId: string; panorama?: boolean }) => {
    const skyId = useId();
    const clipId = useId();

    return (
        <svg
            viewBox={`0 0 800 ${WH}`}
            role="img"
            aria-labelledby={titleId}
        >
            <title id={titleId}>
                Fensterblick: Die Bäume ziehen schnell vorbei, das Haus mittelschnell und die Hügelkette im Hintergrund
                langsam.
            </title>
            <defs>
                <FrameClip id={clipId} />
            </defs>
            {panorama && <SkyGradient id={skyId} />}
            <g clipPath={`url(#${clipId})`}>
                <rect
                    className="sky"
                    x={0}
                    y={0}
                    width={800}
                    height={HOR}
                    style={panorama ? ({ '--sky-fill': `url(#${skyId})` } as CSSProperties) : undefined}
                />
                <rect
                    className="ground"
                    x={0}
                    y={HOR}
                    width={800}
                    height={WH - HOR}
                />
                <line
                    className="horizon"
                    x1={0}
                    y1={HOR}
                    x2={800}
                    y2={HOR}
                />
                {LAYERS.map((hill, i) => (
                    <path
                        key={hill.s}
                        className={`shift ridge ${i === 0 ? 'far' : 'near'}`}
                        d={layerPath(hill)}
                        style={shiftVars(hill.d, hill.s)}
                    />
                ))}
                {SPRITES.map(o => (
                    <g
                        key={`${o.k}-${o.s}`}
                        className={`shift k-${o.k}`}
                        style={shiftVars(o.d, o.s, { '--scale': String(F / o.d), '--y': `${HOR + (2 * F) / o.d}px` })}
                    >
                        <Sprite o={o} />
                    </g>
                ))}
                <line
                    className="axis"
                    x1={400}
                    y1={0}
                    x2={400}
                    y2={WH}
                />
            </g>
            <rect
                className="frame"
                x={1}
                y={1}
                width={798}
                height={WH - 2}
                rx={14}
            />
        </svg>
    );
};
