import { styled } from '@linaria/react';
import { Checkerboard } from './Checkerboard';
import { config, DemoAnimationsCompareProps, SvgStyling } from './shared';

const CssCircleAnimationStyled = styled(SvgStyling)`
    @keyframes slide {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(${config.distance}px);
        }
    }

    & svg circle.css {
        fill: var(--color-sunflower-yellow);
        animation: slide ${config.duration}ms linear ${config.repeats} alternate;
        animation-play-state: paused;
    }

    & svg circle.css.playing {
        animation-play-state: running;
    }
`;

export const Css = ({ isPlaying, resetTrigger }: DemoAnimationsCompareProps) => (
    <CssCircleAnimationStyled>
        <svg viewBox="0 0 200 30">
            <Checkerboard
                width={230}
                height={30}
            />
            <circle
                key={resetTrigger}
                className={`css ${isPlaying ? 'playing' : ''}`}
                cx={config.startX}
                cy={config.circleY}
                r={config.circleRadius}
            />
        </svg>
    </CssCircleAnimationStyled>
);
