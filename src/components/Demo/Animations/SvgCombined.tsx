import { styled } from '@linaria/react';
import { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from '../../../hooks/useAnimationFrame';

const SvgCombinedStyling = styled.div`
    max-width: 450px;

    & svg {
        width: 400px;
        height: 200px;
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

    & svg circle.smil {
        fill: var(--color-fire-red);
    }

    @keyframes slide {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(160px);
        }
    }

    & svg circle.css {
        fill: var(--color-sunflower-yellow);
        animation: slide 5s linear 2 alternate;
        animation-play-state: paused;
    }

    & svg circle.css.playing {
        animation-play-state: running;
    }

    & svg circle.js {
        fill: var(--color-emerald-dark);
    }

    .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
`;

// 5s hin und 5s zurück, dann einmal pause & reset
// Um zu verstecken, dass der JS circle minimal langsamer ist.
// Wird erst nach 5 loops deutlich sichtbar
const TOTAL_DURATION = 2 * 5 * 1000;

export const SvgCombined = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [cssRestartKey, setCssRestartKey] = useState(0);

    const svgRef = useRef<SVGSVGElement | null>(null);
    const circleJsRef = useRef<SVGCircleElement | null>(null);

    const timeRef = useRef(0);
    const leftRef = useRef(true);
    const isPlayingRef = useRef(isPlaying);
    const playTimeRef = useRef(0);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        svg.pauseAnimations();
        svg.setCurrentTime(0);
    }, []);

    const resetJs = () => {
        timeRef.current = 0;
        leftRef.current = true;
        if (circleJsRef.current) {
            circleJsRef.current.setAttribute('cx', '20');
        }
    };

    const resetCss = () => {
        setCssRestartKey(k => k + 1);
    };

    const resetSmil = () => {
        const svg = svgRef.current;
        if (!svg) return;

        svg.pauseAnimations();
        svg.setCurrentTime(0);
    };

    const autoStop = () => {
        if (!isPlayingRef.current) {
            return;
        }

        isPlayingRef.current = false;
        playTimeRef.current = 0;

        resetJs();
        resetCss();
        resetSmil();
        setIsPlaying(false);
    };

    const next = (delta: number) => {
        if (!isPlayingRef.current) {
            return;
        }

        playTimeRef.current += delta;
        if (playTimeRef.current >= TOTAL_DURATION) {
            autoStop();
            return;
        }

        if (!circleJsRef.current) {
            return;
        }

        const cx = (timeRef.current / 5000) * 160;
        circleJsRef.current.setAttribute('cx', `${20 + cx}`);

        if (leftRef.current) {
            timeRef.current += delta;
        } else {
            timeRef.current -= delta;
        }

        if (timeRef.current > 5000) {
            timeRef.current = 5000;
            leftRef.current = false;
        } else if (timeRef.current < 0) {
            timeRef.current = 0;
            leftRef.current = true;
        }
    };

    useAnimationFrame(next);

    const handlePlayPause = () => {
        const svg = svgRef.current;

        setIsPlaying(prev => {
            const next = !prev;

            if (svg) {
                if (next) {
                    svg.unpauseAnimations();
                } else {
                    svg.pauseAnimations();
                }
            }

            return next;
        });
    };

    const handleReset = () => {
        isPlayingRef.current = false;
        playTimeRef.current = 0;

        setIsPlaying(false);
        resetJs();
        resetCss();
        resetSmil();
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
            <svg
                ref={svgRef}
                width={400}
                height={200}
                viewBox="0 0 200 100"
            >
                <defs>
                    <pattern
                        id="checkerboard"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect
                            width="10"
                            height="10"
                            fill="#e8e8e8"
                        />
                        <rect
                            width="5"
                            height="5"
                            fill="#cfcfcf"
                        />
                        <rect
                            x="5"
                            y="5"
                            width="5"
                            height="5"
                            fill="#cfcfcf"
                        />
                    </pattern>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="200"
                    height="100"
                    fill="url(#checkerboard)"
                />
                <circle
                    className="smil"
                    cx={20}
                    cy={20}
                    r={10}
                >
                    <animate
                        attributeName="cx"
                        values="20;180;20"
                        dur="10s"
                        repeatCount="1"
                        begin="0s"
                    />
                </circle>
                <circle
                    key={cssRestartKey}
                    className={`css ${isPlaying ? 'playing' : ''}`}
                    cx={20}
                    cy={50}
                    r={10}
                />
                <circle
                    ref={circleJsRef}
                    className="js"
                    cx={20}
                    cy={80}
                    r={10}
                />
            </svg>
        </SvgCombinedStyling>
    );
};
