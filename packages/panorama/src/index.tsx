'use client';

import { Panorama } from './components/Panorama';
import type { Star } from './lib/stars';
import { TalProvider } from './lib/TalContext';
import type { Weather } from './lib/weather';

export { COVERS, RAINS } from './lib/weather';
export { percentToOktas, skyFromCover, skyFromPercent } from './lib/sky';
export type { Oktas, Sky, SkyBand } from './lib/sky';
export type { CloudPalette, CloudType } from './components/Clouds/cloudTypes';
export type { Cover, Rain, Weather } from './lib/weather';
export type { Star };

interface WtalPanoramaProps {
    /** Shows this weather instead of the weather of the day. */
    weather?: Weather;
    /** The star catalogue; without it the sky has no stars. */
    stars?: readonly Star[];
    /** Draw the clouds with the noise filter instead of the hand-drawn lobes. */
    generatedClouds?: boolean;
}

export const WtalPanorama = ({ weather, stars, generatedClouds }: WtalPanoramaProps) => (
    <TalProvider weather={weather}>
        {/* decorative; display: contents keeps the layout untouched */}
        <div
            aria-hidden="true"
            style={{ display: 'contents' }}
        >
            <Panorama
                stars={stars}
                generatedClouds={generatedClouds}
            />
        </div>
    </TalProvider>
);
