import { styled } from '@linaria/react';
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

    & circle {
        fill: var(--color-teal);
        animation: slide ${config.duration}ms linear ${config.repeats} alternate;
        animation-play-state: paused;
    }

    & circle.playing {
        animation-play-state: running;
    }
`;

export const Css = ({ isPlaying, resetTrigger }: DemoAnimationsCompareProps) => (
    <CssCircleAnimationStyled viewBox="0 0 200 30">
        <circle
            key={resetTrigger}
            className={`css ${isPlaying ? 'playing' : ''}`}
            cx={config.startX}
            cy={config.circleY}
            r={config.circleRadius}
        />
    </CssCircleAnimationStyled>
);
