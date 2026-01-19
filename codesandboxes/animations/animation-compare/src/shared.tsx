type DemoAnimationsCompareConfig = {
    duration: number;
    distance: number;
    repeats: number;
    totalDuration: number;
    startX: number;
    endX: number;
    circleRadius: number;
    circleY: number;
};

const duration = 5000;
const distance = 160;
const repeats = 2;
const totalDuration = repeats * duration;
const startX = 15;
const endX = startX + distance;
const circleRadius = 10;
const circleY = 15;

export const config: DemoAnimationsCompareConfig = {
    duration,
    distance,
    repeats,
    totalDuration,
    startX,
    endX,
    circleRadius,
    circleY,
};

export interface DemoAnimationsCompareProps {
    isPlaying: boolean;
    resetTrigger: number;
}
