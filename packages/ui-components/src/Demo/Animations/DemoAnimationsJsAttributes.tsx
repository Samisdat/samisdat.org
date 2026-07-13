'use client';

import { styled } from '@linaria/react';
import { useAnimationFrame } from '@samisdat/tools';
import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';
import { useEffect, useRef, useState } from 'react';

const SvgWithSunStyling = styled.svg`
    background: var(--color-green);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 1.5;

    & .heaven {
        fill: var(--color-blue);
    }

    & .sunPath {
        fill: none;
        stroke: var(--color-foreground-emphasis);
        stroke-width: 3.5px;
    }

    & .sun {
        fill: var(--color-yellow);
    }
`;

interface Point {
    cx: number;
    cy: number;
}

const dayLength = 3600;

export const DemoAnimationsJsAttributes = () => {
    const pathRef = useRef<SVGPathElement>(null);

    const lengthRef = useRef<number | null>(null);

    const [time, setTime] = useState(0);
    const [speed, setSpeed] = useState(10);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sunPosition, setSunPosition] = useState<Point>({ cx: 40, cy: 260 });

    useEffect(() => {
        if (pathRef.current) {
            lengthRef.current = pathRef.current.getTotalLength();
        }
    }, []);

    const next = (delta: number) => {
        const frames = Math.min(delta, 100) / (1000 / 60);
        setTime(prev => {
            const newTime = (prev + speed * frames) % dayLength;
            
            // Update sun position based on new time
            if (pathRef.current && lengthRef.current) {
                const distance = (lengthRef.current * newTime) / dayLength;
                const point = pathRef.current.getPointAtLength(distance);
                setSunPosition({ cx: point.x, cy: point.y });
            }
            
            return newTime;
        });
    };

    useAnimationFrame(next, isPlaying);

    const onSpeedChange = (value: number) => {
        setSpeed(value);
    };

    const onPlay = () => {
        setIsPlaying(true);
    };

    const onPause = () => {
        setIsPlaying(false);
    };

    const onReset = () => {
        setIsPlaying(false);
        setSpeed(10);
        setTime(0);
    };

    return (
        <DemoAnimation
            playbackControl={{
                isPlaying,
                speedMin: 0,
                speedMax: 40,
                speed,
                onSpeedChange,
                onPlay,
                onPause,
                onReset,
            }}
        >
            <SvgWithSunStyling
                width="100%"
                height="100%"
                viewBox="0 0 450 300"
            >
                <path
                    className="heaven"
                    d="M0,300l0,-300l450,0l0,300l-450,0Z"
                />
                <path
                    ref={pathRef}
                    className="sunPath"
                    d="M40.312,260c-0,0 -0.362,-23.156 -0.306,-54.977c0.18,-103.778 82.864,-165.023 184.93,-165.023c102.065,0 184.755,80.293 184.929,185.711c0.056,33.584 0.135,34.289 0.135,34.289"
                />
                <circle
                    className="sun"
                    r="30"
                    {...sunPosition}
                />
            </SvgWithSunStyling>
        </DemoAnimation>
    );
};
