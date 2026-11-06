'use client';

import { Panorama } from './components/Panorama';
import { TalProvider } from './lib/TalContext';

export const WtalPanorama = () => (
    <TalProvider>
        {/* decorative; display: contents keeps the layout untouched */}
        <div
            aria-hidden="true"
            style={{ display: 'contents' }}
        >
            <Panorama />
        </div>
    </TalProvider>
);
