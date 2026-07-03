'use client';

import { styled } from '@linaria/react';
import { useAnimationFrame } from '@samisdat/tools';
import { DemoCanvas } from '@samisdat/ui-components/DemoCanvas';
import { PlaybackControl } from '@samisdat/ui-components/PlaybackControl';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

const SvgWithSunStyling = styled.svg`
    margin: 1rem;
    width: calc(100% - 2rem);
    background: var(--color-deep-pine);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 1.5;

    & .heaven {
        fill: #0376bf;
    }

    & .sunPath {
        fill: none;
        stroke: #000051;
        stroke-width: 3.5px;
    }
    & .sun {
        fill: #f0ff5e;
    }
`;

interface Point {
    cx: number;
    cy: number;
}

const dayLength = 3600;

export const DemoAnimationsJsAttributes = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const pathRef = useRef<SVGPathElement>(null);

    const lengthRef = useRef<number | null>(null);

    const [time, setTime] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(10);

    useEffect(() => {
        if (pathRef.current) {
            lengthRef.current = pathRef.current.getTotalLength();
        }
    }, []);

    const next = () => {
        setTime(prev => {
            if (prev >= dayLength) {
                return 0;
            }
            return prev + speed;
        });
    };

    useAnimationFrame(next);

    const getPoint = (): Point => {
        if (!pathRef.current || !lengthRef.current) {
            return { cx: 40, cy: 260 };
        }

        const distance = (lengthRef.current * time) / dayLength;
        const point = pathRef.current.getPointAtLength(distance);

        return { cx: point.x, cy: point.y };
    };

    const isPlaying = false;

    const onChangeSpeed = (value: number) => {
        setSpeed(value);
    };

    const handlePlayPause = () => {};
    const handleReset = () => {};

    return (
        <DemoCanvas ref={containerRef}>
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
                    {...getPoint()}
                />
            </SvgWithSunStyling>
            <PlaybackControl
                isPlaying={isPlaying}
                speedMin={0}
                speedMax={40}
                speed={speed}
                onSpeedChange={onChangeSpeed}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
            />
        </DemoCanvas>
    );
};
