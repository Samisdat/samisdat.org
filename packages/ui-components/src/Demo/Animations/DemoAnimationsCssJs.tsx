'use client';

import { styled } from '@linaria/react';
import { useAnimationFrame } from '@samisdat/tools';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';

const ClockSvg = styled.svg`
    fill-rule: evenodd;
    clip-rule: evenodd;
    stroke-linejoin: round;
    stroke-miterlimit: 2;

    & .face {
        fill: #fff;
        fill-rule: nonzero;
    }

    & .dial {
        fill-rule: nonzero;
    }

    & .hourHand,
    & .minuteHand,
    & .secondHand {
        fill-rule: nonzero;
        transform-box: fill-box;
        transform-origin: 50% 100%;
    }

    & .hourHand {
        transform: rotate(calc(1deg * var(--hour, 0)));
    }

    & .minuteHand {
        transform: rotate(calc(1deg * var(--minute, 0)));
    }

    &.paused .hourHand,
    &.paused .minuteHand,
    &.paused .secondHand {
        transition: transform 0.1s linear;
    }

    & .secondHand {
        fill: #e00;
        transform: rotate(calc(1deg * var(--second, 0)));
    }

    & .secondHandCover {
        fill: #e00;
    }
`;

const SvgContent = () => (
    <>
        <path
            className="face"
            d="M294,150c0,78.996 -65.004,144 -144,144c-78.996,0 -144,-65.004 -144,-144c-0,-78.996 65.004,-144 144,-144c78.996,-0 144,65.004 144,144Z"
        />
        <path
            className="dial"
            d="M144.75,15l10.5,0l0,41.1l-10.5,0l0,-41.1Zm68.463,15.612l8.574,4.95l-16.5,28.578l-8.574,-4.95l16.5,-28.578Zm51.225,47.601l4.95,8.574l-28.578,16.5l-4.95,-8.574l28.578,-16.5Zm-102.714,-62.724l4.774,0.501l-1.38,13.128l-4.773,-0.502l1.379,-13.127Zm13.997,1.962l4.695,0.998l-2.745,12.912l-4.695,-0.998l2.745,-12.912Zm13.714,3.415l4.565,1.483l-4.079,12.554l-4.565,-1.483l4.079,-12.554Zm13.282,4.829l4.385,1.953l-5.369,12.058l-4.385,-1.952l5.369,-12.059Zm24.692,13.677l3.884,2.821l-7.759,10.679l-3.883,-2.821l7.758,-10.679Zm11.14,8.698l3.567,3.211l-8.832,9.81l-3.567,-3.212l8.832,-9.809Zm10.17,9.814l3.211,3.567l-9.809,8.832l-3.212,-3.567l9.81,-8.832Zm9.088,10.823l2.821,3.884l-10.679,7.758l-2.821,-3.883l10.679,-7.759Zm14.545,24.191l1.953,4.385l-12.059,5.369l-1.952,-4.385l12.058,-5.369Zm5.299,13.102l1.483,4.565l-12.554,4.079l-1.483,-4.565l12.554,-4.079Zm3.9,13.584l0.998,4.695l-12.912,2.745l-0.998,-4.695l12.912,-2.745Zm2.459,13.918l0.501,4.774l-13.127,1.379l-0.502,-4.773l13.128,-1.38Zm0.99,11.248l0,10.5l-41.1,0l0,-10.5l41.1,0Zm-15.612,68.463l-4.95,8.574l-28.578,-16.5l4.95,-8.574l28.578,16.5Zm-47.601,51.225l-8.574,4.95l-16.5,-28.578l8.574,-4.95l16.5,28.578Zm62.724,-102.714l-0.501,4.774l-13.128,-1.38l0.502,-4.773l13.127,1.379Zm-1.962,13.997l-0.998,4.695l-12.912,-2.745l0.998,-4.695l12.912,2.745Zm-3.415,13.714l-1.483,4.565l-12.554,-4.079l1.483,-4.565l12.554,4.079Zm-4.829,13.282l-1.953,4.385l-12.058,-5.369l1.952,-4.385l12.059,5.369Zm-13.677,24.692l-2.821,3.884l-10.679,-7.759l2.821,-3.883l10.679,7.758Zm-8.698,11.14l-3.211,3.567l-9.81,-8.832l3.212,-3.567l9.809,8.832Zm-9.814,10.17l-3.567,3.211l-8.832,-9.809l3.567,-3.212l8.832,9.81Zm-10.823,9.088l-3.884,2.821l-7.758,-10.679l3.883,-2.821l7.759,10.679Zm-24.191,14.545l-4.385,1.953l-5.369,-12.059l4.385,-1.952l5.369,12.058Zm-13.102,5.299l-4.565,1.483l-4.079,-12.554l4.565,-1.483l4.079,12.554Zm-13.584,3.9l-4.695,0.998l-2.745,-12.912l4.695,-0.998l2.745,12.912Zm-13.918,2.459l-4.774,0.501l-1.379,-13.127l4.773,-0.502l1.38,13.128Zm-11.248,0.99l-10.5,0l-0,-41.1l10.5,0l-0,41.1Zm-68.463,-15.612l-8.574,-4.95l16.5,-28.578l8.574,4.95l-16.5,28.578Zm-51.225,-47.601l-4.95,-8.574l28.578,-16.5l4.95,8.574l-28.578,16.5Zm102.714,62.724l-4.774,-0.501l1.38,-13.128l4.773,0.502l-1.379,13.127Zm-13.997,-1.962l-4.695,-0.998l2.745,-12.912l4.695,0.998l-2.745,12.912Zm-13.714,-3.415l-4.565,-1.483l4.079,-12.554l4.565,1.483l-4.079,12.554Zm-13.282,-4.829l-4.385,-1.953l5.369,-12.058l4.385,1.952l-5.369,12.059Zm-24.692,-13.677l-3.884,-2.821l7.759,-10.679l3.883,2.821l-7.758,10.679Zm-11.14,-8.698l-3.567,-3.211l8.832,-9.81l3.567,3.212l-8.832,9.809Zm-10.17,-9.814l-3.211,-3.567l9.809,-8.832l3.212,3.567l-9.81,8.832Zm-9.088,-10.823l-2.821,-3.884l10.679,-7.758l2.821,3.883l-10.679,7.759Zm-14.545,-24.191l-1.953,-4.385l12.059,-5.369l1.952,4.385l-12.058,5.369Zm-5.299,-13.102l-1.483,-4.565l12.554,-4.079l1.483,4.565l-12.554,4.079Zm-3.9,-13.584l-0.998,-4.695l12.912,-2.745l0.998,4.695l-12.912,2.745Zm-2.459,-13.918l-0.501,-4.774l13.127,-1.379l0.502,4.773l-13.128,1.38Zm-0.99,-11.248l-0,-10.5l41.1,0l-0,10.5l-41.1,0Zm15.612,-68.463l4.95,-8.574l28.578,16.5l-4.95,8.574l-28.578,-16.5Zm47.601,-51.225l8.574,-4.95l16.5,28.578l-8.574,4.95l-16.5,-28.578Zm-62.724,102.714l0.501,-4.774l13.128,1.38l-0.502,4.773l-13.127,-1.379Zm1.962,-13.997l0.998,-4.695l12.912,2.745l-0.998,4.695l-12.912,-2.745Zm3.415,-13.714l1.483,-4.565l12.554,4.079l-1.483,4.565l-12.554,-4.079Zm4.829,-13.282l1.953,-4.385l12.058,5.369l-1.952,4.385l-12.059,-5.369Zm13.677,-24.692l2.821,-3.884l10.679,7.759l-2.821,3.883l-10.679,-7.758Zm8.698,-11.14l3.211,-3.567l9.81,8.832l-3.212,3.567l-9.809,-8.832Zm9.814,-10.17l3.567,-3.211l8.832,9.809l-3.567,3.212l-8.832,-9.81Zm10.823,-9.088l3.884,-2.821l7.758,10.679l-3.883,2.821l-7.759,-10.679Zm24.191,-14.545l4.385,-1.953l5.369,12.059l-4.385,1.952l-5.369,-12.058Zm13.102,-5.299l4.565,-1.483l4.079,12.554l-4.565,1.483l-4.079,-12.554Zm13.584,-3.9l4.695,-0.998l2.745,12.912l-4.695,0.998l-2.745,-12.912Zm13.918,-2.459l4.774,-0.501l1.379,13.127l-4.773,0.502l-1.38,-13.128Z"
        />
        <path
            className="hourHand"
            d="M143.1,150l13.8,0l0,-77.9l-6.9,-6.9l-6.9,6.9l0,77.9Z"
        />
        <path
            className="minuteHand"
            d="M150,21l5.7,5.7l-0.004,123.3l-11.4,0l0.004,-123.3l5.7,-5.7Z"
        />
        <circle
            cx="150"
            cy="150"
            r="15"
        />
        <path
            className="secondHand"
            d="M150,21.2l-1.05,1.2l-0.563,41.184c-7.854,0.808 -13.987,7.449 -13.987,15.516c0,7.92 5.916,14.46 13.566,15.459l-1.266,55.441l6.6,0l-1.266,-55.441c7.65,-0.999 13.566,-7.539 13.566,-15.459c-0,-8.067 -6.133,-14.708 -13.988,-15.516l-0.562,-41.184l-1.05,-1.2Zm0,50.7c3.974,0 7.2,3.226 7.2,7.2c0,3.974 -3.226,7.2 -7.2,7.2c-3.974,0 -7.2,-3.226 -7.2,-7.2c0,-3.974 3.226,-7.2 7.2,-7.2Z"
        />
        <circle
            className="secondHandCover"
            cx="150"
            cy="150"
            r="8.5"
        />
    </>
);
const initialTime = () => new Date(2000, 0, 1, 10, 10, 31).getTime();

export const DemoAnimationsCssJs = () => {
    const timeMsRef = useRef<number>(initialTime());
    const [speed, setSpeed] = useState(1);

    const ref = useRef<SVGSVGElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const syncFromTime = useCallback(() => {
        const now = new Date(timeMsRef.current);
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const element = ref.current;
        if (element) {
            const secondAngle = seconds * 6;
            const minuteAngle = minutes * 6;
            const hourAngle = ((hours % 12) + minutes / 60) * 30;

            element.style.setProperty('--second', String(secondAngle));
            element.style.setProperty('--minute', String(minuteAngle));
            element.style.setProperty('--hour', String(hourAngle));
        }
    }, []);

    useEffect(() => {
        syncFromTime();
    }, [syncFromTime]);

    const tick = (delta: number) => {
        timeMsRef.current += Math.min(delta, 100) * speed;

        const wrapped = new Date(timeMsRef.current);
        if (wrapped.getHours() >= 12) {
            wrapped.setHours(wrapped.getHours() - 12);
        }
        wrapped.setFullYear(2000, 0, 1);
        timeMsRef.current = wrapped.getTime();

        syncFromTime();
    };

    useAnimationFrame(tick, isPlaying);

    const onPlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const onPause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const onReset = useCallback(() => {
        setIsPlaying(false);
        setSpeed(1);

        timeMsRef.current = initialTime();
        syncFromTime();
    }, [syncFromTime]);

    const onSpeedChange = useCallback((value: number) => {
        setSpeed(value);
    }, []);

    return (
        <DemoAnimation
            playbackControl={{
                isPlaying,
                speedMin: -200,
                speedMax: 200,
                speed,
                onSpeedChange,
                onPlay,
                onPause,
                onReset,
            }}
        >
            <ClockSvg
                ref={ref}
                viewBox="0 0 300 300"
                className={isPlaying ? '' : 'paused'}
            >
                <SvgContent />
            </ClockSvg>
        </DemoAnimation>
    );
};
