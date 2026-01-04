import { useEffect, useRef } from 'react';
import { DemoAnimationsCombinedProps } from '.';
import { DemoAnimationsCombinedCheckerboard } from './Checkerboard';
import { AnimationContainer, CIRCLE_RADIUS, END_X, START_X, TOTAL_DURATION } from './shared';

export const DemoAnimationsCombinedSmil = ({ isPlaying, resetTrigger }: DemoAnimationsCombinedProps) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        svg.pauseAnimations();
        svg.setCurrentTime(0);
    }, []);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        if (isPlaying) {
            svg.unpauseAnimations();
        } else {
            svg.pauseAnimations();
        }
    }, [isPlaying]);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        svg.pauseAnimations();
        svg.setCurrentTime(0);
    }, [resetTrigger]);

    return (
        <AnimationContainer>
            <svg
                ref={svgRef}
                viewBox="0 0 200 30"
            >
                <DemoAnimationsCombinedCheckerboard
                    width={230}
                    height={30}
                />
                <circle
                    cx={START_X}
                    cy={15}
                    r={CIRCLE_RADIUS}
                    fill="var(--color-fire-red)"
                >
                    <animate
                        attributeName="cx"
                        values={`${START_X};${END_X};${START_X}`}
                        dur={`${TOTAL_DURATION}ms`}
                        repeatCount="1"
                        begin="0s"
                    />
                </circle>
            </svg>
        </AnimationContainer>
    );
};
