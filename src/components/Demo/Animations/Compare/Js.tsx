import { useAnimationFrame } from '@/hooks/useAnimationFrame';
import { useEffect, useRef } from 'react';
import { styled } from 'storybook/theming';
import { Checkerboard } from './Checkerboard';
import {
    ANIMATION_DISTANCE,
    ANIMATION_DURATION,
    CIRCLE_RADIUS,
    CIRCLE_Y,
    DemoAnimationsCompareProps,
    START_X,
    SvgStyling,
} from './shared';

const JsStyling = styled(SvgStyling)`
    & circle.js {
        fill: var(--color-emerald-dark);
    }
`;

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
            circleRef.current.setAttribute('cx', String(START_X));
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
        if (timeRef.current >= ANIMATION_DURATION) {
            timeRef.current = ANIMATION_DURATION;
            leftRef.current = false;
        } else if (timeRef.current <= 0) {
            timeRef.current = 0;
            leftRef.current = true;
        }

        // Calculate and apply position
        const progress = timeRef.current / ANIMATION_DURATION;
        const cx = START_X + progress * ANIMATION_DISTANCE;
        circleRef.current.setAttribute('cx', String(cx));
    };

    useAnimationFrame(next);

    return (
        <JsStyling viewBox="0 0 200 30">
            <Checkerboard
                width={230}
                height={30}
            />
            <circle
                ref={circleRef}
                className="js"
                cx={START_X}
                cy={CIRCLE_Y}
                r={CIRCLE_RADIUS}
            />
        </JsStyling>
    );
};
