import { styled } from 'storybook/theming';
import { DemoAnimationsCombinedProps } from '.';
import { DemoAnimationsCombinedCheckerboard } from './Checkerboard';
import {
    ANIMATION_DISTANCE,
    ANIMATION_DURATION,
    ANIMATION_REPEATS,
    AnimationContainer,
    CIRCLE_RADIUS,
    CIRCLE_Y,
    START_X,
} from './shared';

const CssCircleAnimationStyled = styled(AnimationContainer)`
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

export const DemoAnimationsCombinedCss = ({ isPlaying, resetTrigger }: DemoAnimationsCombinedProps) => {
    return (
        <CssCircleAnimationStyled>
            <svg viewBox="0 0 200 30">
                <DemoAnimationsCombinedCheckerboard
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
};
