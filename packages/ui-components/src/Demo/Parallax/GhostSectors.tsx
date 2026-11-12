'use client';

import { GhostDemo } from '@samisdat/ui-components/DemoAnimation/GhostDemo';

import { GHOST_HINT, scriptForDevice, type GhostDeviceProps } from './ghostDevice';
import { DemoParallaxSectors } from './Sectors';

/** Sectors demo with a device recording; MDX cannot pass render props. */
export const DemoGhostSectors = ({ device, resumeAfterMs, loop }: GhostDeviceProps) => (
    <GhostDemo
        script={scriptForDevice(device)}
        hint={GHOST_HINT}
        resumeAfterMs={resumeAfterMs}
        loop={loop}
    >
        {(source) => <DemoParallaxSectors source={source} />}
    </GhostDemo>
);
