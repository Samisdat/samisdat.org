import { styled } from '@linaria/react';
import { aubergine, ivory } from '@samisdat/color-scheme/primitives';

const BlackCircle = styled.circle`
    fill: ${aubergine[950]};
`;

const WhiteCircle = styled.circle`
    fill: ${ivory[100]};
`;

const CIRCLES = [
    ['black', 100, 100],
    ['white', 105, 95],
    ['black', 110, 90],
    ['white', 115, 85],
    ['black', 120, 80],
    ['white', 125, 75],
    ['black', 130, 70],
    ['white', 135, 65],
    ['black', 140, 60],
    ['white', 145, 55],
    ['black', 150, 50],
    ['white', 155, 45],
    ['black', 160, 40],
    ['white', 155, 35],
    ['black', 150, 30],
    ['white', 145, 25],
    ['black', 140, 20],
    ['white', 135, 15],
    ['black', 130, 10],
    ['white', 125, 5],
    ['black', 122.5, 2.5],
] as const;

export const DiscSvg = ({ initialDur }: { initialDur: number }) => (
    <svg viewBox="0 0 200 200">
        <g>
            {CIRCLES.map(([kind, cx, r]) => {
                const Circle = kind === 'black' ? BlackCircle : WhiteCircle;
                return (
                    <Circle
                        key={`${kind}-${cx}-${r}`}
                        cx={cx}
                        cy="100"
                        r={r}
                    />
                );
            })}
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 100 100"
                to="360 100 100"
                dur={`${initialDur}s`}
                repeatCount="indefinite"
            ></animateTransform>
        </g>
    </svg>
);
