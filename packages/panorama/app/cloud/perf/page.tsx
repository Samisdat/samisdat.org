'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { GeneratedCloud } from '@/components/Clouds/GeneratedCloud';
import { generatedCloudPresets } from '@/components/Clouds/generatedCloudPresets';

const WIDTH = 1700;

interface Result {
    frames: number;
    mean: number;
    p95: number;
    max: number;
}

/** Frame times of the drift over a few seconds, for comparing N generated clouds with N plain ellipses. */
const measure = (seconds: number): Promise<Result> =>
    new Promise(resolve => {
        const times: number[] = [];
        const start = performance.now();
        let last = start;
        const frame = (now: number) => {
            times.push(now - last);
            last = now;

            if (now - start < seconds * 1000) {
                requestAnimationFrame(frame);

                return;
            }

            const sorted = times.slice(1).sort((a, b) => a - b);

            resolve({
                frames: sorted.length,
                mean: sorted.reduce((sum, time) => sum + time, 0) / sorted.length,
                p95: sorted[Math.floor(sorted.length * 0.95)],
                max: sorted[sorted.length - 1],
            });
        };

        requestAnimationFrame(frame);
    });

const CloudPerf = () => {
    const query = useSearchParams();
    const params = { n: Number(query.get('n') ?? 15), mode: query.get('mode') ?? 'generated' };
    const [result, setResult] = useState<Result>();
    // `tint=N` changes the colours every N ms, like the sky does while time runs fast; 0 keeps them still.
    const tintEvery = Number(query.get('tint') ?? 0);
    const [shade, setShade] = useState(0);

    useEffect(() => {
        if (0 === tintEvery) {
            return undefined;
        }

        const timer = setInterval(() => setShade(value => (value + 1) % 20), tintEvery);

        return () => clearInterval(timer);
    }, [tintEvery]);

    useEffect(() => {
        measure(5).then(next => {
            setResult(next);
            (window as unknown as { __perf: Result }).__perf = next;
        });
    }, []);

    const looks = Object.values(generatedCloudPresets);
    const clouds = Array.from({ length: params.n }, (_, index) => {
        const look = looks[index % looks.length];

        return { look, id: `${index}`, cx: ((index + 0.5) / params.n) * WIDTH, cy: 80 + ((index * 37) % 180) };
    });

    return (
        <main style={{ padding: 16 }}>
            <svg
                viewBox="0 0 1200 330"
                style={{ width: 1200, height: 330, background: '#7fb4c7' }}
            >
                <g style={{ animation: 'perfDrift 20s linear infinite' }}>
                    {clouds.map(({ look, id, cx, cy }, index) =>
                        'generated' === params.mode ? (
                            <GeneratedCloud
                                key={id}
                                {...look}
                                seed={index}
                                body={`#${(0xf0 - shade).toString(16)}f0ff`}
                                shade={`#${(0x80 + shade).toString(16)}9bb5`}
                                cx={cx}
                                cy={cy}
                            />
                        ) : (
                            <ellipse
                                key={id}
                                cx={cx}
                                cy={cy}
                                rx={look.rx}
                                ry={look.ry}
                                fill="#fff"
                            />
                        )
                    )}
                </g>
            </svg>
            <style>{'@keyframes perfDrift { to { transform: translateX(-1700px); } }'}</style>
            <pre>{JSON.stringify({ ...params, ...result })}</pre>
        </main>
    );
};

export default function CloudPerfPage() {
    return (
        <Suspense>
            <CloudPerf />
        </Suspense>
    );
}
