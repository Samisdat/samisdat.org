import { memo, useEffect, useMemo, useRef } from 'react';

import { spawner } from './bumpLayer';
import { DriftState, Placement, positions, startDrift, step } from './cloudDrift';
import { Flow, flowParts } from './cloudFlow';
import { isBump, SKY_WIDTH } from './cloudLayout';
import { drawCloud } from './cloudOutline';

import type { BumpCloudType } from './bumpCloud';
import type { CloudLayer, PlacedBump } from './cloudLayout';

/** Longest step the drift takes at once, so a tab coming back from the background does not make the clouds jump. */
const MAX_STEP = 0.1;

/** `?cloudspeed=20` runs drift and life twenty times as fast, as in a time-lapse. */
const speedUp = () => Number(new URLSearchParams(window.location.search).get('cloudspeed')) || 1;

const PARTS = ['body', 'shade'] as const;

/** Each cloud is drawn at its place and again one sky width to the left, so it drifts out on one side and in on the other. */
const COPIES = [0, -SKY_WIDTH] as const;

/**
 * Redraws per second each cloud gets. At the real speed of the sky a lobe moves a pixel or two a second, three
 * redraws are smooth; a time-lapse needs more, up to seven.
 */
const redrawsAt = (factor: number) => Math.min(7, 3 * factor);

const wrap = (x: number) => ((x % SKY_WIDTH) + SKY_WIDTH) % SKY_WIDTH;

const keyOf = (id: number, part: string, copy: number) => `${id}-${part}-${copy}`;

const transformOf = ({ x, y }: Placement, copy: number) => `translate(${x + copy} ${y})`;

type Elements = Map<string, SVGPathElement>;

const setPaths = (elements: Elements, id: number, body: string, shade: string) =>
    COPIES.forEach(copy => {
        elements.get(keyOf(id, 'body', copy))?.setAttribute('d', body);
        elements.get(keyOf(id, 'shade', copy))?.setAttribute('d', shade);
    });

/**
 * Keeps the shapes of a layer's clouds going: every frame it draws a few of them again from their flow, in turn, so
 * each one changes some times a second and a frame stays cheap. A cloud that has just been born is drawn at once.
 */
const shaper = (clouds: PlacedBump[], redraws: number) => {
    const flows = new Map(clouds.map(({ id, flow }) => [id, flow]));
    const urgent = new Set<number>();
    let turn = 0;
    let budget = 0;

    const redraw = (id: number, t: number, mass: number, elements: Elements) => {
        const flow = flows.get(id);

        if (flow) {
            const { body, shade } = drawCloud(flowParts(flow, t, mass));

            setPaths(elements, id, body, shade);
        }
    };

    return {
        reborn: (id: number, flow: Flow) => {
            flows.set(id, flow);
            urgent.add(id);
        },
        shape: (t: number, seconds: number, placements: Map<number, Placement>, elements: Elements) => {
            const ids = [...flows.keys()];
            const mass = (id: number) => placements.get(id)?.scale ?? 1;

            urgent.forEach(id => redraw(id, t, mass(id), elements));
            urgent.clear();
            budget += ids.length * redraws * seconds;

            const count = Math.min(ids.length, Math.floor(budget));

            budget -= count;

            for (let index = 0; index < count; index += 1) {
                const id = ids[turn++ % ids.length];

                redraw(id, t, mass(id), elements);
            }
        },
    };
};

/** Moves every cloud to where it is now. */
const place = (placements: Map<number, Placement>, elements: Elements) =>
    placements.forEach((placement, id) =>
        PARTS.forEach(part =>
            COPIES.forEach(copy =>
                elements.get(keyOf(id, part, copy))?.setAttribute('transform', transformOf(placement, copy))
            )
        )
    );

/**
 * Runs the drift of a layer and keeps its clouds moving and changing, without rendering React again on every frame.
 * It starts over only for a new layer: the panorama renders again as the day goes on, and the clouds must keep going.
 */
const useDrift = (layer: CloudLayer, clouds: PlacedBump[], elements: React.RefObject<Elements>) => {
    useEffect(() => {
        if (!layer.drift || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        const spawn = spawner(layer.type as BumpCloudType, SKY_WIDTH);
        let state: DriftState = startDrift(SKY_WIDTH, layer.drift, layer.oktas * 31 + layer.duration, spawn);
        const factor = speedUp();
        const shapes = shaper(clouds, redrawsAt(factor));
        let last = performance.now();
        let t = 0;
        let frame = 0;

        const tick = (now: number) => {
            const seconds = Math.min(MAX_STEP, (now - last) / 1000);

            last = now;
            t += seconds * factor;
            state = step(state, seconds * factor);
            state.reshaped.forEach(({ id, flow }) => flow && shapes.reborn(id, flow));

            const placements = positions(state);

            shapes.shape(t, seconds, placements, elements.current);
            place(placements, elements.current);
            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [layer, clouds, elements]);
};

/**
 * The bump clouds of a layer: each drifting at the speed of its group, its lobes blown up on the windward side and
 * let out on the lee side. All bodies are drawn first, then all undersides, so clouds that meet read as one cloud.
 */
// Memoised: the panorama renders again with the clock, and the layer (cached per sky) stays the same.
export const DriftingClouds = memo(function DriftingClouds({ layer }: { layer: CloudLayer }) {
    const elements = useRef<Elements>(new Map());
    const clouds = useMemo(() => layer.clouds.filter(isBump), [layer]);

    useDrift(layer, clouds, elements);

    return (
        <>
            {PARTS.map(part => (
                <g
                    key={part}
                    className={'body' === part ? 'cloudBody' : 'cloudShade'}
                >
                    {clouds.flatMap(cloud =>
                        COPIES.map(copy => {
                            const key = keyOf(cloud.id, part, copy);

                            return (
                                <path
                                    key={key}
                                    ref={element => {
                                        if (element) {
                                            elements.current.set(key, element);
                                        } else {
                                            elements.current.delete(key);
                                        }
                                    }}
                                    transform={`translate(${wrap(cloud.x) + copy} ${cloud.y})`}
                                    d={cloud[part]}
                                />
                            );
                        })
                    )}
                </g>
            ))}
        </>
    );
});
