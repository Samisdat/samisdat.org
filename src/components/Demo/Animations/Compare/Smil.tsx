import { useEffect, useRef } from 'react';
import { Checkerboard } from './Checkerboard';
import { CIRCLE_RADIUS, DemoAnimationsCompareProps, END_X, START_X, SvgStyling, TOTAL_DURATION } from './shared';

export const Smil = ({ isPlaying, resetTrigger }: DemoAnimationsCompareProps) => {
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
        <SvgStyling
            ref={svgRef}
            viewBox="0 0 200 30"
        >
            <Checkerboard
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
        </SvgStyling>
    );
};
