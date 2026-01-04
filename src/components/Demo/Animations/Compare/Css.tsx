import { styled } from 'storybook/theming';
import { Checkerboard } from './Checkerboard';
import {
    ANIMATION_DISTANCE,
    ANIMATION_DURATION,
    ANIMATION_REPEATS,
    CIRCLE_RADIUS,
    CIRCLE_Y,
    DemoAnimationsCompareProps,
    START_X,
    SvgStyling,
} from './shared';

const CssCircleAnimationStyled = styled(SvgStyling)`
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
                cx={START_X}
                cy={CIRCLE_Y}
                r={CIRCLE_RADIUS}
            />
        </svg>
    </CssCircleAnimationStyled>
);
