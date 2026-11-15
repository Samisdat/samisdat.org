import { useRef } from 'react';

import { setAttrs } from './dom';
import { HOR, OBJECTS, project, ridge, WH, XMIN } from './scene';
import { useRaysView } from './state';

import type { SceneObject } from './scene';
import type { RaysState } from './state';

/** Everything with a sprite, far to near, so that nearer things cover farther ones. */
const SPRITES = OBJECTS.filter(o => o.k !== 'hill').sort((a, b) => b.d - a.d);

const spriteAttrs = (tx: number, o: SceneObject) => {
    const { x, scale } = project(tx, o);

    return { transform: `translate(${x.toFixed(2)},${(HOR + 2 * scale).toFixed(2)}) scale(${scale.toFixed(4)})` };
};

const Sprite = ({ o }: { o: SceneObject }) =>
    o.k === 'tree' ? (
        <>
            <rect className="trunk" x={-0.7} y={-6} width={1.4} height={6} />
            <circle className="crown" cx={0} cy={-9.5} r={4.5} />
        </>
    ) : (
        <>
            <rect className="wall" x={-12} y={-9} width={24} height={9} />
            <path className="roof" d="M-14,-9L0,-17L14,-9Z" />
            <rect className="opening" x={-2} y={-5} width={4} height={5} />
            <rect className="opening" x={-9} y={-6.5} width={4} height={3} />
            <rect className="opening" x={5} y={-6.5} width={4} height={3} />
        </>
    );

export const WindowView = ({ state, titleId }: { state: RaysState; titleId: string }) => {
    const far = useRef<SVGPathElement>(null);
    const near = useRef<SVGPathElement>(null);
    const sprites = useRef<(SVGGElement | null)[]>([]);

    useRaysView(state, tx => {
        setAttrs(far.current, { d: ridge(tx, 226, 330) });
        setAttrs(near.current, { d: ridge(tx, 150, 226) });
        SPRITES.forEach((o, i) => setAttrs(sprites.current[i], spriteAttrs(tx, o)));
    });

    return (
        <svg viewBox={`0 0 800 ${WH}`} role="img" aria-labelledby={titleId}>
            <title id={titleId}>
                Fensterblick: Die Bäume ziehen schnell vorbei, das Haus mittelschnell und die Hügelkette im Hintergrund
                langsam.
            </title>
            <rect className="sky" x={0} y={0} width={800} height={HOR} />
            <rect className="ground" x={0} y={HOR} width={800} height={WH - HOR} />
            <line className="horizon" x1={0} y1={HOR} x2={800} y2={HOR} />
            <path ref={far} className="ridge far" d={ridge(XMIN, 226, 330)} />
            <path ref={near} className="ridge near" d={ridge(XMIN, 150, 226)} />
            {SPRITES.map((o, i) => (
                <g
                    key={`${o.k}-${o.s}`}
                    ref={el => {
                        sprites.current[i] = el;
                    }}
                    className={`k-${o.k}`}
                    {...spriteAttrs(XMIN, o)}
                >
                    <Sprite o={o} />
                </g>
            ))}
            <line className="axis" x1={400} y1={0} x2={400} y2={WH} />
            <rect className="frame" x={1} y={1} width={798} height={WH - 2} rx={14} />
        </svg>
    );
};
