'use client';

import { useState } from 'react';

import { GeneratedCloud } from '@/components/Clouds/GeneratedCloud';
import { generatedCloudPresets } from '@/components/Clouds/generatedCloudPresets';

const CONTROLS = [
    { key: 'seed', min: 0, max: 100, step: 1 },
    { key: 'baseFrequency', min: 0.002, max: 0.03, step: 0.001 },
    { key: 'octaves', min: 1, max: 8, step: 1 },
    { key: 'scale', min: 0, max: 240, step: 5 },
    { key: 'blur', min: 0, max: 60, step: 1 },
] as const;

export default function CloudPage() {
    const [values, setValues] = useState({ seed: 3, baseFrequency: 0.012, octaves: 4, scale: 120, blur: 24 });

    return (
        <main style={{ padding: 16, display: 'grid', gap: 12, maxWidth: 900 }}>
            <svg
                viewBox="0 0 800 400"
                style={{ width: '100%', background: 'linear-gradient(165deg, #527785 0%, #7fb4c7 100%)' }}
            >
                <GeneratedCloud
                    cx={400}
                    cy={200}
                    rx={220}
                    ry={90}
                    seed={values.seed}
                    baseFrequency={values.baseFrequency}
                    octaves={values.octaves}
                    scale={values.scale}
                    blur={values.blur}
                />
            </svg>
            <svg
                viewBox="0 0 800 520"
                style={{ width: '100%', background: 'linear-gradient(165deg, #527785 0%, #7fb4c7 100%)' }}
            >
                {Object.entries(generatedCloudPresets).map(([type, look], index) => (
                    <g key={type}>
                        <GeneratedCloud
                            cx={400}
                            cy={60 + index * 100}
                            {...look}
                        />
                        <text
                            x={12}
                            y={70 + index * 100}
                            fill="#fff"
                            fontSize={14}
                        >
                            {type}
                        </text>
                    </g>
                ))}
            </svg>
            {CONTROLS.map(({ key, ...range }) => (
                <label key={key}>
                    {key}: {values[key]}
                    <input
                        type="range"
                        {...range}
                        value={values[key]}
                        onChange={event => setValues({ ...values, [key]: Number(event.target.value) })}
                        style={{ display: 'block', width: '100%' }}
                    />
                </label>
            ))}
        </main>
    );
}
