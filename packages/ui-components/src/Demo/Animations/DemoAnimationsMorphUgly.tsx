import { styled } from '@linaria/react';
import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';
import { DemoCanvas } from '@samisdat/ui-components/DemoCanvas';
import { PlaybackControl } from '@samisdat/ui-components/PlaybackControl';
import { useEffect, useRef, useState } from 'react';
const HillsSvgStyling = styled.svg`
    & svg {
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linejoin: round;
        stroke-miterlimit: 2;
    }

    & svg path {
        fill-rule: nonzero;
        fill: var(--color-green);
    }
`;

const steam1 =
    'M50,50l-50,-0l0,-37.069c0,0 2.978,0.548 5.614,0.395c2.19,-0.127 4.477,-1.053 6.392,-1.572c1.713,-0.464 3.811,-0.819 5.097,-1.54c1.112,-0.623 1.691,-2.524 2.619,-2.786c0.928,-0.261 1.885,1.251 2.947,1.217c0.194,-0.006 0.403,-0.056 0.623,-0.136l-0,-0.043c-0,-0 0.272,-0.107 0.692,-0.268c0.93,-0.474 1.956,-1.142 2.821,-1.039c0.367,-0.128 0.705,-0.239 0.975,-0.319c1.455,-0.431 3.038,-2.675 4.421,-2.722c1.384,-0.048 2.707,2.11 3.878,2.435c1.024,0.285 2.312,-0.957 3.152,-0.483c0.839,0.474 0.951,2.459 1.883,3.328c1.078,1.006 3.031,1.849 4.585,2.706c1.738,0.958 4.301,3.176 4.301,3.176l-0,34.72Z';
const steam2 =
    'M50,50l-50,0l0,0c0,0 2.978,0 5.614,0c2.19,0 4.477,0 6.392,0c1.713,0 3.811,0 5.097,0c1.112,0 1.691,0 2.619,0c0.928,0 1.885,0 2.947,0c0.194,0 0.403,0 0.623,0l-0,0c-0,0 0.272,0 0.692,0c0.93,0 1.956,0 2.821,0c0.367,0 0.705,0 0.975,0c1.455,0 3.038,0 4.421,0c1.384,0 2.707,0 3.878,0c1.024,0 2.312,0 3.152,0c0.839,0 0.951,0 1.883,0c1.078,0 3.031,0 4.585,0c1.738,0 4.301,0 4.301,0l-0,0Z';

const steam3 =
    'M0,50l0,-16.295c0,-0 1.252,0.555 2.284,0.511c1.071,-0.046 2.704,-0.601 3.368,-1.044c0.361,-0.241 0.346,-1.421 0.615,-1.616c0.269,-0.196 0.664,0.58 0.999,0.442c0.68,-0.28 2.107,-1.695 3.085,-2.126c0.9,-0.396 1.876,-0.106 2.783,-0.458c1.253,-0.487 3.448,-1.798 4.733,-2.463c0.992,-0.514 2.293,-1.364 2.978,-1.528c0.389,-0.092 0.739,0.48 1.13,0.549c0.402,0.071 0.981,0.038 1.287,-0.124c0.239,-0.126 0.293,-0.867 0.545,-0.848c0.274,0.022 0.705,0.772 1.104,0.977c0.571,0.294 1.56,0.763 2.32,0.784c0.758,0.021 1.488,-0.82 2.24,-0.655c0.916,0.202 2.434,1.67 3.261,1.864c0.578,0.135 1.342,-0.696 1.697,-0.704c0.199,-0.004 0.266,0.492 0.436,0.658c0.175,0.17 0.405,0.425 0.614,0.366c0.209,-0.059 0.385,-0.808 0.64,-0.723c0.279,0.095 0.619,1.097 1.039,1.288c0.624,0.284 1.968,0.588 2.708,0.419c0.642,-0.146 1.298,-1.347 1.733,-1.431c0.348,-0.067 0.563,0.69 0.882,0.927c0.664,0.494 2.553,1.37 3.102,2.035c0.326,0.394 -0.111,1.514 0.193,1.952c0.36,0.52 1.577,0.628 1.969,1.163c0.336,0.459 0.059,1.561 0.381,2.046c0.327,0.493 1.081,0.715 1.582,0.911c0.462,0.182 0.292,0.205 0.292,0.205l-0,12.918l-50,-0Z';
const steam4 =
    'M0,50l0,0c0,0 1.252,0 2.284,0c1.071,0 2.704,0 3.368,0c0.361,0 0.346,0 0.615,0c0.269,0 0.664,0 0.999,0c0.68,0 2.107,0 3.085,0c0.9,0 1.876,0 2.783,0c1.253,0 3.448,0 4.733,0c0.992,0 2.293,0 2.978,0c0.389,0 0.739,0 1.13,0c0.402,0 0.981,0 1.287,0c0.239,0 0.293,0 0.545,0c0.274,0 0.705,0 1.104,0c0.571,0 1.56,0 2.32,0c0.758,0 1.488,0 2.24,0c0.916,0 2.434,0 3.261,0c0.578,0 1.342,0 1.697,0c0.199,0 0.266,0 0.436,0c0.175,0 0.405,0 0.614,0c0.209,0 0.385,0 0.64,0c0.279,0 0.619,0 1.039,0c0.624,0 1.968,0 2.708,0c0.642,0 1.298,0 1.733,0c0.348,0 0.563,0 0.882,0c0.664,0 2.553,0 3.102,0c0.326,0 -0.111,0 0.193,0c0.36,0 1.577,0 1.969,0c0.336,0 0.059,0 0.381,0c0.327,0 1.081,0 1.582,0c0.462,0 0.292,0 0.292,0l-0,0l-50,0Z';
export const DemoAnimationsMorphUgly = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [speed, setSpeed] = useState<number>(40);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const onSpeedChange = (value: number) => {
        setSpeed(value);
    };

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        containerRef.current.querySelector('animate')?.setAttribute('dur', `${speed}s`);
    }, [speed]);

    const onPlay = () => {
        setIsPlaying(true);
    };
    const onPause = () => {
        setIsPlaying(false);
    };
    const onReset = () => {
        setIsPlaying(false);
    };

    return (
        <DemoAnimation
            ref={containerRef}
            playbackControl={{
                isPlaying,
                speedMin: 0,
                speedMax: 80,
                speed,
                onSpeedChange,
                onPlay,
                onPause,
                onReset,
            }}
        >
            <HillsSvgStyling viewBox="0 0 50 50">
                <rect
                    x="0"
                    y="0"
                    width="50"
                    height="50"
                    style={{ fill: 'var(--color-cyan)' }}
                />{' '}
                <path
                    d={steam1}
                    style={{ fill: 'var(--color-green)' }}
                >
                    <animate
                        attributeName="d"
                        dur={`${speed}s`}
                        repeatCount="indefinite"
                        values={`${steam1};${steam2};${steam1}`}
                    />
                </path>
                <path
                    d={steam3}
                    style={{ fill: 'var(--color-green)' }}
                >
                    <animate
                        attributeName="d"
                        dur={`${speed}s`}
                        repeatCount="indefinite"
                        values={`${steam3};${steam4};${steam3}`}
                    />
                </path>
            </HillsSvgStyling>
        </DemoAnimation>
    );
};
