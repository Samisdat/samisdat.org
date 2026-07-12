import { useEffect, useRef } from 'react';
import { config, DemoAnimationsCompareProps, SvgStyling } from './shared';

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
            <circle
                cx={config.startX}
                cy={config.circleY}
                r={config.circleRadius}
                fill="var(--color-red)"
            >
                <animate
                    attributeName="cx"
                    values={`${config.startX};${config.endX};${config.startX}`}
                    dur={`${config.totalDuration}ms`}
                    repeatCount="1"
                    begin="0s"
                />
            </circle>
        </SvgStyling>
    );
};
