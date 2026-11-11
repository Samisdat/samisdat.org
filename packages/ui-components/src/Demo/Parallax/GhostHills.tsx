'use client';

import { Grid } from '@samisdat/ui-components/Grid';
import { GhostDemo } from '@samisdat/ui-components/DemoAnimation/GhostDemo';
import { trackpadDemoScript } from '@samisdat/ui-components/InteractionGhost';

import { HillsPicture } from './HillsPicture';

const HINT = 'Bewege den Zeiger oder tippe auf die Demo, um selbst zu steuern.';

/** Hills picture with the trackpad ghost; the overlay sits exactly on the image. */
export const DemoGhostHills = () => (
    <Grid container>
        <Grid
            small={8}
            medium={4}
        >
            <GhostDemo
                script={trackpadDemoScript}
                aspectRatio={450 / 600}
                hint={HINT}
            >
                {(source) => <HillsPicture source={source} />}
            </GhostDemo>
        </Grid>
    </Grid>
);
