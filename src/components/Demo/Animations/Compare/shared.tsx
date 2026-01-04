import { styled } from 'storybook/theming';
import { DemoAnimationsCompare } from '.';

export const ANIMATION_DURATION = 5000; // ms for one direction
export const ANIMATION_DISTANCE = 160; // px to travel
export const ANIMATION_REPEATS = 2; // forward and back
export const TOTAL_DURATION = ANIMATION_REPEATS * ANIMATION_DURATION;
export const START_X = 15;
export const END_X = START_X + ANIMATION_DISTANCE; // 180
export const CIRCLE_RADIUS = 10;
export const CIRCLE_Y = 15; // centered in 66px height SVG

export type DemoAnimationsCompareConfig = {
    duration: number;
    distance: number;
    repeats: number;
    totalDuration: number;
    startX: number;
    endX: number;
    circleRadius: number;
    circleY: number;
};

export const config = {};

export const SvgStyling = styled.svg`
    max-width: 450px;
    width: 100%;
    fill-rule: evenodd;
    clip-rule: evenodd;
    stroke-linejoin: round;
    stroke-miterlimit: 1;
    display: block;

    & circle {
        fill-rule: nonzero;
        stroke: var(--color-aubergine);
        stroke-width: 0.5px;
    }
`;

export interface DemoAnimationsCompareProps {
    isPlaying: boolean;
    resetTrigger: number;
}
