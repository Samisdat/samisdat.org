'use client';

import { Panorama } from './components/Panorama';
import { TalProvider } from './lib/TalContext';

import type { Star } from './lib/stars';
import type { Weather } from './lib/weather';
import type { ReactNode } from 'react';

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
    /** Extra controls, shown in the footer of the time control overlay. */
    controls?: ReactNode;
}

export const WtalPanorama = ({ weather, stars, controls }: WtalPanoramaProps) => (
    <TalProvider weather={weather}>
        <Panorama
            stars={stars}
            controls={controls}
        />
    </TalProvider>
);
