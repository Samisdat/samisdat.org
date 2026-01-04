import { styled } from 'storybook/theming';

export const ANIMATION_DURATION = 5000; // ms for one direction
export const ANIMATION_DISTANCE = 160; // px to travel
export const ANIMATION_REPEATS = 2; // forward and back
export const TOTAL_DURATION = ANIMATION_REPEATS * ANIMATION_DURATION;
export const START_X = 15;
export const END_X = START_X + ANIMATION_DISTANCE; // 180
export const CIRCLE_RADIUS = 10;
export const CIRCLE_Y = 15; // centered in 66px height SVG

export const AnimationContainer = styled.div`
    max-width: 450px;
    & svg {
        width: 100%;
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linejoin: round;
        stroke-miterlimit: 1;
        display: block;
    }

    & svg circle {
        fill-rule: nonzero;
        stroke: var(--color-aubergine);
        stroke-width: 0.5px;
    }
`;
