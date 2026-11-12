'use client';

import { Grid } from '@samisdat/ui-components/Grid';
import { GhostDemo } from '@samisdat/ui-components/DemoAnimation/GhostDemo';

import { GHOST_HINT, scriptForDevice, type GhostDeviceProps } from './ghostDevice';
import { HillsPicture } from './HillsPicture';

/** Hills picture with a device recording; the overlay sits exactly on the image. */
export const DemoGhostHills = ({ device, resumeAfterMs, loop }: GhostDeviceProps) => (
    <Grid container>
        <Grid
            small={8}
            medium={4}
        >
            <GhostDemo
                script={scriptForDevice(device)}
                aspectRatio={450 / 600}
                hint={GHOST_HINT}
                resumeAfterMs={resumeAfterMs}
                loop={loop}
            >
                {(source) => <HillsPicture source={source} />}
            </GhostDemo>
        </Grid>
    </Grid>
);
