import type { SketchProps } from './types';

const PW = 9;
const PH = 20;
const PD = 1.6;
const MAX_TILT = 0.52;
const EXAGGERATION = 2;

type V3 = [number, number, number];

const FACES: { id: string; v: V3[]; n: V3 }[] = [
    {
        id: 'back',
        v: [
            [PW, -PH, -PD],
            [-PW, -PH, -PD],
            [-PW, PH, -PD],
            [PW, PH, -PD],
        ],
        n: [0, 0, -1],
    },
    {
        id: 'top',
        v: [
            [-PW, -PH, PD],
            [PW, -PH, PD],
            [PW, -PH, -PD],
            [-PW, -PH, -PD],
        ],
        n: [0, -1, 0],
    },
    {
        id: 'bottom',
        v: [
            [-PW, PH, PD],
            [PW, PH, PD],
            [PW, PH, -PD],
            [-PW, PH, -PD],
        ],
        n: [0, 1, 0],
    },
    {
        id: 'left',
        v: [
            [-PW, -PH, PD],
            [-PW, PH, PD],
            [-PW, PH, -PD],
            [-PW, -PH, -PD],
        ],
        n: [-1, 0, 0],
    },
    {
        id: 'right',
        v: [
            [PW, -PH, PD],
            [PW, PH, PD],
            [PW, PH, -PD],
            [PW, -PH, -PD],
        ],
        n: [1, 0, 0],
    },
    {
        id: 'front',
        v: [
            [-PW, -PH, PD],
            [PW, -PH, PD],
            [PW, PH, PD],
            [-PW, PH, PD],
        ],
        n: [0, 0, 1],
    },
];
const SCREEN: V3[] = [
    [-7, -16.5, PD + 0.05],
    [7, -16.5, PD + 0.05],
    [7, 16.5, PD + 0.05],
    [-7, 16.5, PD + 0.05],
];
const LEVEL: V3[] = Array.from({ length: 25 }, (_, i) => [
    Math.cos((i / 24) * 2 * Math.PI) * 5,
    Math.sin((i / 24) * 2 * Math.PI) * 5,
    PD + 0.1,
]);

const deg = (rad: number) => {
    const d = Math.round((rad * 180) / Math.PI);

    return `${d < 0 ? '−' : '+'}${Math.abs(d)}°`;
};

export const TiltSketch = ({ frame }: SketchProps) => {
    const beta = frame.tilt?.beta ?? frame.norm.y * MAX_TILT;
    const gamma = frame.tilt?.gamma ?? frame.norm.x * MAX_TILT;
    // the wireframe turns twice as far as recorded, so the small sketch shows the movement; the numbers stay real
    const [cb, sb, cg, sg] = [
        Math.cos(beta * EXAGGERATION),
        Math.sin(beta * EXAGGERATION),
        Math.cos(gamma * EXAGGERATION),
        Math.sin(gamma * EXAGGERATION),
    ];

    const rot = ([x, y, z]: V3): V3 => {
        const y1 = y * cb - z * sb;
        const z1 = y * sb + z * cb;

        return [x * cg + z1 * sg, y1, -x * sg + z1 * cg];
    };
    const proj = (p: V3): V3 => {
        const [a, b, c] = rot(p);
        const k = 110 / (110 - c);

        return [36 + a * k, 26 + b * k, k];
    };
    const points = (list: V3[]) =>
        list
            .map(p => {
                const [x, y] = proj(p);

                return `${x.toFixed(2)},${y.toFixed(2)}`;
            })
            .join(' ');
    const ball = proj([(gamma / MAX_TILT) * 3, (beta / MAX_TILT) * 3, PD + 0.1]);

    return (
        <>
            {FACES.filter(f => rot(f.n)[2] > 0.02).map(f => (
                <polygon
                    key={f.id}
                    className="sk"
                    points={points(f.v)}
                />
            ))}
            <polygon
                className="sk"
                points={points(SCREEN)}
            />
            <polyline
                className="sk-solid"
                points={points(LEVEL)}
            />
            <circle
                className="sk-fill"
                cx={ball[0]}
                cy={ball[1]}
                r={1.2 * ball[2]}
            />
            <text
                className="sk-text"
                x={60}
                y={22}
            >{`β ${deg(beta)}`}</text>
            <text
                className="sk-text"
                x={60}
                y={31}
            >{`γ ${deg(gamma)}`}</text>
        </>
    );
};
