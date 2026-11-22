import { useRef } from 'react';

import { buildContours } from './contours';
import { setAttrs } from './dom';
import { cone, OBJECTS, OY, P, sight, XMIN } from './scene';
import { useRaysView } from './state';

import type { SceneObject } from './scene';
import type { RaysState } from './state';

const contours = buildContours(d => OY - d);
const ties = Array.from({ length: Math.ceil(880 / 24) + 1 }, (_, i) => XMIN + i * 24);

const coneAttrs = (tx: number) => ({ d: cone(tx) });
const trainAttrs = (tx: number) => ({ transform: `translate(${tx},${OY + 9})` });
const rayAttrs = (tx: number, o: SceneObject) => {
    const { eye, target } = sight(tx, o);

    return { x1: String(eye[0]), y1: String(eye[1]), x2: String(target[0]), y2: String(target[1]) };
};

const MapObject = ({ o }: { o: SceneObject }) => {
    const [x, y] = P(o.s, o.d);

    if (o.k === 'hill') {
        return (
            <path
                className="hill-mark"
                d={`M${x - 7},${y + 5}L${x},${y - 6}L${x + 7},${y + 5}Z`}
            />
        );
    }
    if (o.k === 'house') {
        return (
            <g className="house-mark">
                <rect
                    x={x - 14}
                    y={y - 10}
                    width={28}
                    height={10}
                    fillOpacity={0.55}
                />
                <rect
                    x={x - 14}
                    y={y}
                    width={28}
                    height={10}
                    fillOpacity={0.25}
                />
                <line
                    x1={x - 14}
                    y1={y}
                    x2={x + 14}
                    y2={y}
                />
            </g>
        );
    }

    return (
        <g className="tree-mark">
            <circle
                cx={x}
                cy={y}
                r={12}
                fillOpacity={0.3}
            />
            <circle
                cx={x}
                cy={y}
                r={4}
            />
        </g>
    );
};

const Tracks = () => (
    <g className="rail">
        {ties.map(s => (
            <line
                key={s}
                x1={s}
                y1={OY + 22}
                x2={s}
                y2={OY - 4}
                strokeOpacity={0.5}
            />
        ))}
        <line
            x1={0}
            y1={OY + 3}
            x2={800}
            y2={OY + 3}
        />
        <line
            x1={0}
            y1={OY + 15}
            x2={800}
            y2={OY + 15}
        />
    </g>
);

export const MapView = ({ state, titleId }: { state: RaysState; titleId: string }) => {
    const coneRef = useRef<SVGPathElement>(null);
    const trainRef = useRef<SVGGElement>(null);
    const wedges = useRef<(SVGPathElement | null)[]>([]);
    const rays = useRef<(SVGLineElement | null)[]>([]);

    useRaysView(state, (tx, dir) => {
        setAttrs(coneRef.current, coneAttrs(tx));
        setAttrs(trainRef.current, trainAttrs(tx));
        OBJECTS.forEach((o, i) => {
            setAttrs(wedges.current[i], { d: sight(tx, o, dir).wedge });
            setAttrs(rays.current[i], rayAttrs(tx, o));
        });
    });

    return (
        <svg
            viewBox="0 0 800 360"
            role="img"
            aria-labelledby={titleId}
        >
            <title id={titleId}>
                Draufsicht: Der Zug fährt an Bäumen, einem Haus und einer Hügelkette vorbei. Der Winkel, den ein
                Sehstrahl in einer halben Sekunde überstreicht, ist bei den Bäumen groß, beim Haus mittel und bei der
                Hügelkette klein.
            </title>
            <rect
                className="map-bg"
                x={0}
                y={0}
                width={800}
                height={360}
            />
            <path
                ref={coneRef}
                className="cone"
                {...coneAttrs(XMIN)}
            />
            {contours.map(c => (
                <path
                    key={c.level}
                    className={c.index ? 'contour index' : 'contour'}
                    d={c.d}
                />
            ))}
            <Tracks />
            {OBJECTS.map((o, i) => (
                <g
                    key={`${o.k}-${o.s}`}
                    className={`k-${o.k}`}
                >
                    <MapObject o={o} />
                    <path
                        ref={el => {
                            wedges.current[i] = el;
                        }}
                        className="wedge"
                        d={sight(XMIN, o).wedge}
                    />
                    <line
                        ref={el => {
                            rays.current[i] = el;
                        }}
                        className="ray"
                        {...rayAttrs(XMIN, o)}
                    />
                </g>
            ))}
            <g
                ref={trainRef}
                className="train"
                {...trainAttrs(XMIN)}
            >
                <rect
                    x={-34}
                    y={-9}
                    width={68}
                    height={18}
                    rx={5}
                />
                <circle
                    cx={0}
                    cy={-9}
                    r={4.5}
                />
            </g>
        </svg>
    );
};
