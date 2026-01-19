import { useAnimationFrame } from '@/hooks/useAnimationFrame';
import { styled } from '@linaria/react';
import { CSSProperties, useEffect, useRef } from 'react';
import { Checkerboard } from './Checkerboard';
import { config, DemoAnimationsCompareProps, SvgStyling } from './shared';

const JsCssStyling = styled(SvgStyling)`
    & circle.jscss {
        fill: var(--color-aqua-gray);
        transform: translateX(calc(1px * var(--posX)));
    }
`;

export const JsCss = ({ isPlaying, resetTrigger }: DemoAnimationsCompareProps) => {
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
            circleRef.current.style.setProperty('--posX', String(config.startX));
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
        if (timeRef.current >= config.duration) {
            timeRef.current = config.duration;
            leftRef.current = false;
        } else if (timeRef.current <= 0) {
            timeRef.current = 0;
            leftRef.current = true;
        }

        // Calculate and apply position
        const progress = timeRef.current / config.duration;
        const cx = config.startX + progress * config.distance;
        circleRef.current.style.setProperty('--posX', String(cx));
    };

    useAnimationFrame(next);

    return (
        <JsCssStyling viewBox="0 0 200 30">
            <Checkerboard
                width={230}
                height={30}
            />
            <circle
                ref={circleRef}
                className="jscss"
                cx={0}
                cy={config.circleY}
                r={config.circleRadius}
                style={
                    {
                        ['--posX' as string]: String(config.startX),
                    } as CSSProperties
                }
            />
        </JsCssStyling>
    );
};
