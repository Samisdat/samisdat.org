'use client';

import { Panorama } from './components/Panorama';
import { TalProvider } from './lib/TalContext';
import { Weather } from './lib/weather';

export { COVERS, RAINS } from './lib/weather';
export { percentToOktas, skyFromCover, skyFromPercent } from './lib/sky';
export type { Oktas, Sky, SkyBand } from './lib/sky';
export type { CloudPalette, CloudType } from './components/Clouds/cloudTypes';
export type { Cover, Rain, Weather } from './lib/weather';

interface WtalPanoramaProps {
    /** Shows this weather instead of the weather of the day. */
    weather?: Weather;
}

export const WtalPanorama = ({ weather }: WtalPanoramaProps) => (
    <TalProvider weather={weather}>
        {/* decorative; display: contents keeps the layout untouched */}
        <div
            aria-hidden="true"
            style={{ display: 'contents' }}
        >
            <Panorama />
        </div>
    </TalProvider>
);
