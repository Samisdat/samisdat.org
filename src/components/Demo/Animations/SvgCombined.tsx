import { styled } from '@linaria/react';
import { CSSProperties, useRef } from 'react';
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
            transform: translateX(160);
        }
    }

    & svg circle.css {
        fill: var(--color-sunflower-yellow);
        animation: slide 5s linear infinite alternate;
    }
    & svg circle.js {
        fill: var(--color-emerald-dark);
    }
`;

export const SvgCombined = () => {
    const circleRef = useRef<SVGCircleElement>(null);

    const timeRef = useRef(0);

    const leftRef = useRef(true);

    const next = (delta: number) => {
        if (circleRef.current) {
            const cx = (timeRef.current / 5000) * 160;

            circleRef.current.setAttribute('cx', `${20 + cx}`);
        }

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

    const second = 0;

    return (
        <SvgCombinedStyling>
            <svg
                width={400}
                height={200}
                viewBox="0 0 200 100"
                style={
                    {
                        ['--second' as string]: String(second),
                    } as CSSProperties
                }
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
                        dur={'10s'}
                        repeatCount="indefinite"
                    />
                </circle>
                <circle
                    className="css"
                    cx={20}
                    cy={50}
                    r={10}
                />
                <circle
                    ref={circleRef}
                    className="js"
                    cx={20}
                    cy={80}
                    r={10}
                />
            </svg>
        </SvgCombinedStyling>
    );
};
