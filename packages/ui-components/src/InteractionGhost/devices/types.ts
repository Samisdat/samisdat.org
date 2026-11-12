import type { Device, Frame } from '../script';

/** Input of the device sketches: the ghost player frame, only `norm` is required. Ages are in ms. */
export type DeviceFrame = Pick<Frame, 'norm'> & Partial<Pick<Frame, 'finger' | 'press' | 'tilt'>>;

export type DeviceKind = Device;

export type SketchProps = {
    frame: DeviceFrame;
};
