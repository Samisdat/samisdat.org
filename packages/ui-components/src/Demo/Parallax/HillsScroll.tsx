'use client';

import { Grid } from '@samisdat/ui-components/Grid';

import { HillsView } from './HillsView';
import { ScrollParallax } from './ScrollParallax';

export const DemoParallaxHillsScroll = () => (
    <Grid container>
        <Grid
            small={8}
            medium={4}
            orderSmall={1}
        >
            <ScrollParallax>
                <HillsView />
            </ScrollParallax>
        </Grid>
    </Grid>
);
