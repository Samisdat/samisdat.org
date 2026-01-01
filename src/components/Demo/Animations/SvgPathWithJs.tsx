import { styled } from '@linaria/react';
import { ChangeEvent, useRef, useState,useEffect} from 'react';
import { useAnimationFrame } from '../../../hooks/useAnimationFrame';

const SvgAnimationStyling = styled.div`
    max-width: 450px;

    & svg {
        width: 450px;
        height: 300px;
        background: var(--color-deep-pine);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-miterlimit: 1.5;
    }

    & svg .heaven {
        fill: #0376bf;
    }

    & svg .sunPath {
        fill: none;
        stroke: #000051;
        stroke-width: 3.5px;
    }
    & svg .sun {
        fill: #f0ff5e;
    }
`;

interface Point {
    cx: number;
    cy: number;
}

const dayLength = 3600;

export const SvgPathWithJs = () => {
    const pathRef = useRef<SVGPathElement>(null);

    const lengthRef = useRef<number | null>(null);

    const [time, setTime] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(10);

    useEffect(() => {
        if (pathRef.current) {
            lengthRef.current = pathRef.current.getTotalLength();
        }
    }, []);

    const next = () => {
        setTime(prev => {
            if (prev >= dayLength) {
                return 0;
            }
            return prev + speed;
        });
    };

    useAnimationFrame(next);

    const getPoint = (): Point => {
        if (!pathRef.current || !lengthRef.current) {
            return { cx: 40, cy: 260 };
        }

        const distance = (lengthRef.current * time) / dayLength;
        const point = pathRef.current.getPointAtLength(distance);

        return { cx: point.x, cy: point.y };
    };

    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(evt.target.value, 10);
        setSpeed(Number.isNaN(value) ? 0 : value);
    };

    return (
        <SvgAnimationStyling>
            <label>
                Geschwindigkeit
                <input
                    type="range"
                    name="speed"
                    min="0"
                    max="40"
                    value={speed}
                    onChange={onChange}
                />
            </label>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 450 300"
            >
                <path
                    className="heaven"
                    d="M0,300l0,-300l450,0l0,300l-450,0Z"
                />
                <path
                    ref={pathRef}
                    className="sunPath"
                    d="M40.312,260c-0,0 -0.362,-23.156 -0.306,-54.977c0.18,-103.778 82.864,-165.023 184.93,-165.023c102.065,0 184.755,80.293 184.929,185.711c0.056,33.584 0.135,34.289 0.135,34.289"
                />
                <circle
                    className="sun"
                    r="30"
                    {...getPoint()}
                />
            </svg>
        </SvgAnimationStyling>
    );
};
