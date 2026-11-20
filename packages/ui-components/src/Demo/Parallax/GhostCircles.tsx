'use client';

import { GhostDemo } from '@samisdat/ui-components/DemoAnimation/GhostDemo';

import { DemoParallaxCircles } from './Circles';
import { GHOST_HINT, scriptForDevice, type GhostDeviceProps } from './ghostDevice';

/** Circles demo with a device recording; MDX cannot pass render props. */
export const DemoGhostCircles = ({ device, resumeAfterMs, loop, canvas }: GhostDeviceProps) => (
    <GhostDemo
        script={scriptForDevice(device)}
        hint={GHOST_HINT}
        resumeAfterMs={resumeAfterMs}
        loop={loop}
        canvas={canvas}
    >
        {(source) => <DemoParallaxCircles source={source} />}
    </GhostDemo>
);
