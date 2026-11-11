'use client';

import { GhostDemo } from '@samisdat/ui-components/DemoAnimation/GhostDemo';
import { trackpadDemoScript } from '@samisdat/ui-components/InteractionGhost';

import { DemoParallaxSectors } from './Sectors';

const HINT = 'Bewege den Zeiger oder tippe auf die Demo, um selbst zu steuern.';

/** Sectors demo with the trackpad ghost; MDX cannot pass render props. */
export const DemoGhostSectors = () => (
    <GhostDemo
        script={trackpadDemoScript}
        hint={HINT}
    >
        {(source) => <DemoParallaxSectors source={source} />}
    </GhostDemo>
);
