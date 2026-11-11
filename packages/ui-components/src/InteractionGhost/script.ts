import type { Norm } from '@samisdat/tools';

/** Tuple form of `Norm` (x, y in -1..1, center is 0) for compact script literals. */
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

export type Phase = 'tap' | 'pan';

export type Frame = {
    /** value fed to the demos */
    norm: Norm;
    finger: Finger;
    /** kind of the current step, null while waiting or finished */
    phase: Phase | null;
};
