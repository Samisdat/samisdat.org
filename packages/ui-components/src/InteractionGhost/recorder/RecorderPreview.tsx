import { styled } from '@linaria/react';

import { createSpline } from '../spline';

import type { Point, Script } from '../script';
import type { RecordedEvent } from './types';

const VIEW_WIDTH = 150;
const SAMPLES = 24;
const RAW_BREAK_MS = 400;

const Svg = styled.svg`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;

    & .raw {
        stroke: var(--color-text-subtle);
        stroke-width: 0.4;
        stroke-dasharray: 1 1.2;
    }

    & .smooth {
        stroke: var(--color-ink-sapphire);
        stroke-width: 0.9;
    }

    & .waypoint {
        fill: var(--color-surface-default);
        stroke: var(--color-ink-sapphire);
        stroke-width: 0.6;
    }

    & .target {
        stroke: var(--color-ink-sapphire);
        stroke-width: 0.7;
        stroke-dasharray: 1.6 2;
    }
`;

/** Raw events as polylines; a new line starts at a press, a click or after a pause. */
export const rawRuns = (events: readonly RecordedEvent[]): Point[][] => {
    const runs: Point[][] = [];
    let last: RecordedEvent | undefined;
    for (const e of events) {
        if (e.type === 'click') {
            runs.push([[e.x, e.y]]);
        } else {
            const fresh = e.type === 'down' || !last || last.type === 'up' || e.t - last.t > RAW_BREAK_MS;
            if (fresh) runs.push([]);
            runs[runs.length - 1].push([e.x, e.y]);
        }
        last = e;
    }
    return runs;
};

type Shape = { line?: Point[]; dots: Point[]; target?: Point };

const shapeOf = (step: Script[number]): Shape | null => {
    if ('tap' in step) return { dots: [], target: step.tap };
    if ('click' in step) return { dots: [], target: step.click };
    const points = 'pan' in step ? step.pan : 'move' in step ? step.move : null;
    if (!points || points.length === 0) return null;
    if (points.length < 2) return { dots: points };
    const spline = createSpline(points);
    return { line: Array.from({ length: SAMPLES + 1 }, (_, i) => spline.at(i / SAMPLES)), dots: points };
};

export type RecorderPreviewProps = {
    events: readonly RecordedEvent[];
    script: Script;
    /** width / height of the demo; the viewBox is 150 wide */
    aspectRatio: number;
};

/** Raw trace (thin, dashed) against the simplified spline (solid) with its waypoints. */
export const RecorderPreview = ({ events, script, aspectRatio }: RecorderPreviewProps) => {
    const height = VIEW_WIDTH / aspectRatio;
    const toSvg = ([x, y]: Point) => ({ x: (x + 1) * (VIEW_WIDTH / 2), y: (y + 1) * (height / 2) });
    const poly = (points: Point[]) =>
        points
            .map(toSvg)
            .map((p) => `${p.x},${p.y}`)
            .join(' ');
    const shapes = script.map(shapeOf);

    return (
        <Svg
            aria-hidden="true"
            data-testid="recorder-preview"
            viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        >
            {rawRuns(events).map((run, i) =>
                run.length > 1 ? (
                    <polyline
                        // positional, never reordered
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        className="raw"
                        points={poly(run)}
                    />
                ) : null
            )}
            {shapes.map((shape, i) => {
                if (!shape) return null;
                const target = shape.target && toSvg(shape.target);

                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <g key={i}>
                        {shape.line && (
                            <polyline
                                className="smooth"
                                points={poly(shape.line)}
                            />
                        )}
                        {target && (
                            <circle
                                className="target"
                                cx={target.x}
                                cy={target.y}
                                r={4}
                            />
                        )}
                        {shape.dots.map((dot, j) => (
                            <circle
                                // eslint-disable-next-line react/no-array-index-key
                                key={j}
                                className="waypoint"
                                cx={toSvg(dot).x}
                                cy={toSvg(dot).y}
                                r={1.2}
                            />
                        ))}
                    </g>
                );
            })}
        </Svg>
    );
};
