'use client';

import { useParallax } from '@samisdat/tools';
import { Grid } from '@samisdat/ui-components/Grid';
import { useRef } from 'react';

import { HillsView } from './HillsView';

export const DemoParallaxHills = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    useParallax(ref);

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
