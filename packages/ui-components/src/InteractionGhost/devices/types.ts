/** Input of the device sketches; structurally compatible with the ghost player frame. */
export type DeviceFrame = {
    /** Pointer position, -1…1, center 0. */
    norm: { x: number; y: number };
    finger?: { x: number; y: number; presence: number; down: boolean; age: number };
    press?: { down: boolean; age: number };
    /** Radians. */
    tilt?: { beta: number; gamma: number };
};

export type DeviceKind = 'pad' | 'mouse' | 'touch' | 'tilt';

export type SketchProps = {
    frame: DeviceFrame;
};
