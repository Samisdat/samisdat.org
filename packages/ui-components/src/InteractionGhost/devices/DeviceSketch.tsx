import { MouseSketch } from './MouseSketch';
import { PadSketch } from './PadSketch';
import { SketchSvg } from './SketchSvg';
import { TiltSketch } from './TiltSketch';
import { TouchSketch } from './TouchSketch';

import type { DeviceFrame, DeviceKind } from './types';

export type DeviceSketchProps = {
    kind: DeviceKind;
    frame: DeviceFrame;
    /** The user took over: fade the sketch. */
    dimmed?: boolean;
};

const SKETCHES = {
    pad: PadSketch,
    mouse: MouseSketch,
    touch: TouchSketch,
    tilt: TiltSketch,
};

/** Mini device drawing in currentColor, meant for the PlaybackControl. */
export const DeviceSketch = ({ kind, frame, dimmed = false }: DeviceSketchProps) => {
    const Sketch = SKETCHES[kind];

    return (
        <SketchSvg dimmed={dimmed}>
            <Sketch frame={frame} />
        </SketchSvg>
    );
};
