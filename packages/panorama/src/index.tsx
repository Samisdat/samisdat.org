'use client';

import { Panorama } from './components/Panorama';
import { TalProvider } from './lib/TalContext';

import type { Star } from './lib/stars';

export type { Star };

export const WtalPanorama = ({ stars }: { stars?: readonly Star[] }) => (
    <TalProvider>
        {/* decorative; display: contents keeps the layout untouched */}
        <div
            aria-hidden="true"
            style={{ display: 'contents' }}
        >
            <Panorama stars={stars} />
        </div>
    </TalProvider>
);
