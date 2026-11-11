'use client';

import { type NormSource, useParallax } from '@samisdat/tools';
import { Grid } from '@samisdat/ui-components/Grid';
import { useRef } from 'react';

import { HillsView } from './HillsView';

type DemoParallaxHillsProps = {
    /** Drives the demo instead of the pointer on the container. */
    source?: NormSource;
};

export const DemoParallaxHills = ({ source }: DemoParallaxHillsProps = {}) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useParallax(ref, {}, source);

    return (
        <Grid container>
            <Grid
                small={8}
                medium={4}
                orderSmall={1}
            >
                <div ref={ref}>
                    <HillsView />
                </div>
            </Grid>
            <Grid
                small={8}
                medium={4}
            >
                foo
            </Grid>
        </Grid>
    );
};
