'use client';

import { GhostRecorder } from '@samisdat/ui-components/InteractionGhost';

import { DemoParallaxSectors } from './Sectors';

/** Authoring tool for ghost scripts: only rendered while developing, never in a production build. */
export const DemoGhostRecorder = () => {
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return <GhostRecorder>{source => <DemoParallaxSectors source={source} />}</GhostRecorder>;
};
