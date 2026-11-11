/** Normalized coordinate: x, y in -1..1, center is 0. */
export type Point = [x: number, y: number];

export type TapStep = { tap: Point };
export type PanStep = { pan: Point[]; ms: number };
export type WaitStep = { wait: number };

export type Step = TapStep | PanStep | WaitStep;

export type Script = readonly Step[];

export type Finger = {
    x: number;
    y: number;
    /** 0..1, fade in / out of the marker */
    presence: number;
    /** finger is in contact with the surface */
    down: boolean;
    /** ms since the finger went down, Infinity if it has not (or no longer) */
    age: number;
};

export type Frame = {
    /** value fed to the demos */
    norm: { x: number; y: number };
    finger: Finger;
};
