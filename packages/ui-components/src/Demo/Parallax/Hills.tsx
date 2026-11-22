'use client';

import { type NormSource } from '@samisdat/tools';
import { Grid } from '@samisdat/ui-components/Grid';

import { HillsPicture } from './HillsPicture';

type DemoParallaxHillsProps = {
    /** Drives the demo instead of the pointer on the container. */
    source?: NormSource;
};

export const DemoParallaxHills = ({ source }: DemoParallaxHillsProps = {}) => (
    <Grid container>
        <Grid
            small={8}
            medium={4}
            orderSmall={1}
        >
            <HillsPicture source={source} />
        </Grid>
        <Grid
            small={8}
            medium={4}
        >
            foo
        </Grid>
    </Grid>
);
