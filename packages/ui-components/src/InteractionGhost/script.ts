import type { Norm } from '@samisdat/tools';

/** Tuple form of `Norm` (x, y in -1..1, center is 0) for compact script literals. */
export type Point = [x: number, y: number];

export type Device = 'pad' | 'mouse' | 'touch' | 'tilt';

export type TapStep = { tap: Point };
/** mouse click: short press at the point */
export type ClickStep = { click: Point };
export type PanStep = { pan: Point[]; ms: number };
/** pointer path without a press */
export type MoveStep = { move: Point[]; ms: number };
/** device tilt along a path; x drives gamma, y drives beta */
export type TiltStep = { tilt: Point[]; ms: number };
export type WaitStep = { wait: number };

export type Step = TapStep | ClickStep | PanStep | MoveStep | TiltStep | WaitStep;

/** Steps plus an optional device kind (absent = 'pad'). Plain step arrays stay valid. */
export type Script = readonly Step[] & { readonly device?: Device };

export const scriptDevice = (script: Script): Device => script.device ?? 'pad';

export const defineScript = (device: Device, steps: readonly Step[]): Script => Object.assign([...steps], { device });

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

export type Phase = 'tap' | 'click' | 'pan' | 'move' | 'tilt';

export type Press = {
    down: boolean;
    /** ms since the press began, Infinity if it has not (or no longer) */
    age: number;
};

/** Device orientation in radians. */
export type Tilt = { beta: number; gamma: number };

export type Frame = {
    /** value fed to the demos */
    norm: Norm;
    finger: Finger;
    /** kind of the current step, null while waiting or finished */
    phase: Phase | null;
    /** press state (same data as finger.down / finger.age) */
    press?: Press;
    /** set for tilt scripts and tilt steps */
    tilt?: Tilt;
};
