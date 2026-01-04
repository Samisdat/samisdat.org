import { styled } from '@linaria/react';
import { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from '../../../../hooks/useAnimationFrame';
import { Checkerboard } from './Checkerboard';

const ANIMATION_DURATION = 5000; // ms for one direction
const ANIMATION_DISTANCE = 160; // px to travel
const ANIMATION_REPEATS = 2; // forward and back
const TOTAL_DURATION = ANIMATION_REPEATS * ANIMATION_DURATION;
const START_X = 15;
const END_X = START_X + ANIMATION_DISTANCE; // 180
const CIRCLE_RADIUS = 10;
const CIRCLE_Y = 15; // centered in 66px height SVG

interface DemoAnimationsCombinedProps {
    isPlaying: boolean;
    resetTrigger: number;
}

const AnimationContainer = styled.div`
    max-width: 450px;
    & svg {
        width: 100%;
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linejoin: round;
        stroke-miterlimit: 1;
        display: block;
    }

    & svg circle {
        fill-rule: nonzero;
        stroke: var(--color-aubergine);
        stroke-width: 0.5px;
    }
`;

const SvgCombinedStyling = styled.div`
    max-width: 450px;

    .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
`;

const SmilCircleAnimation = ({ isPlaying, resetTrigger }: DemoAnimationsCombinedProps) => {
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
            </svg>
        </AnimationContainer>
    );
};

const CssCircleAnimationStyled = styled(AnimationContainer)`
    @keyframes slide {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(${ANIMATION_DISTANCE}px);
        }
    }

    & svg circle.css {
        fill: var(--color-sunflower-yellow);
        animation: slide ${ANIMATION_DURATION}ms linear ${ANIMATION_REPEATS} alternate;
        animation-play-state: paused;
    }

    & svg circle.css.playing {
        animation-play-state: running;
    }
`;

const CssCircleAnimation = ({ isPlaying, resetTrigger }: DemoAnimationsCombinedProps) => {
    return (
        <CssCircleAnimationStyled>
            <svg viewBox="0 0 200 30">
                <Checkerboard
                    width={230}
                    height={30}
                />
                <circle
                    key={resetTrigger}
                    className={`css ${isPlaying ? 'playing' : ''}`}
                    cx={START_X}
                    cy={CIRCLE_Y}
                    r={CIRCLE_RADIUS}
                />
            </svg>
        </CssCircleAnimationStyled>
    );
};

const JsCircleAnimationStyled = styled(AnimationContainer)`
    & svg circle.js {
        fill: var(--color-emerald-dark);
    }
`;

const JsCircleAnimation = ({ isPlaying, resetTrigger }: DemoAnimationsCombinedProps) => {
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
        <JsCircleAnimationStyled>
            <svg viewBox="0 0 200 30">
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
            </svg>
        </JsCircleAnimationStyled>
    );
};

export const DemoAnimationsCombined = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setResetCounter(prev => prev + 1);
    };

    return (
        <SvgCombinedStyling>
            <div className="controls">
                <button
                    type="button"
                    onClick={handlePlayPause}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
            <SmilCircleAnimation
                isPlaying={isPlaying}
                resetTrigger={resetCounter}
            />
            <CssCircleAnimation
                isPlaying={isPlaying}
                resetTrigger={resetCounter}
            />
            <JsCircleAnimation
                isPlaying={isPlaying}
                resetTrigger={resetCounter}
            />
        </SvgCombinedStyling>
    );
};
