'use client';
import Panorama from './components/Panorama';
import { TalProvider } from './lib/TalContext';

export const WtalPanorama = () => (
    <TalProvider>
        <Panorama />
    </TalProvider>
);

export {default as Panorama} from './components/Panorama'
export { TalProvider } from './lib/TalContext';
