import { useEffect, useRef } from 'react';
import { Checkerboard } from './Checkerboard';
import { config, DemoAnimationsCompareProps } from './shared';
import { useAnimationFrame } from './useAnimationFrame';

export const Js = ({ isPlaying, resetTrigger }: DemoAnimationsCompareProps) => {
    const circleRef = useRef<SVGCircleElement | null>(null);
    const timeRef = useRef(0);
    const leftRef = useRef(true);
    const isPlayingRef = useRef(isPlaying);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        timeRef.current = 0;
        leftRef.current = true;
        if (circleRef.current) {
            circleRef.current.setAttribute('cx', String(config.startX));
        }
    }, [resetTrigger]);

    const next = (delta: number) => {
        if (!isPlayingRef.current || !circleRef.current) {
            return;
        }

        // Update time
        if (leftRef.current) {
            timeRef.current += delta;
        } else {
            timeRef.current -= delta;
        }

        // Check bounds and reverse direction
        if (timeRef.current >= config.duration) {
            timeRef.current = config.duration;
            leftRef.current = false;
        } else if (timeRef.current <= 0) {
            timeRef.current = 0;
            leftRef.current = true;
        }

        // Calculate and apply position
        const progress = timeRef.current / config.duration;
        const cx = config.startX + progress * config.distance;
        circleRef.current.setAttribute('cx', String(cx));
    };

    useAnimationFrame(next);

    return (
        <svg viewBox="0 0 200 30">
            <Checkerboard
                width={230}
                height={30}
            />
            <circle
                ref={circleRef}
                className="js"
                cx={config.startX}
                cy={config.circleY}
                r={config.circleRadius}
            />
        </svg>
    );
};
