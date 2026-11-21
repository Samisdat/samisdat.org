'use client';

import { type Star, WtalPanorama } from '@samisdat/wtal-panorama';
import { useEffect, useState } from 'react';

/** The panorama with its star catalogue (public/stars, CC BY-SA 4.0, kept out of the MIT package). */
export const SkyPanorama = () => {
    const [stars, setStars] = useState<readonly Star[]>();

    useEffect(() => {
        const controller = new AbortController();

        fetch('/stars/stars.json', { signal: controller.signal })
            .then(response => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
            .then((data: Star[]) => setStars(data))
            // The sky works without stars, so a failed load stays silent.
            .catch(() => undefined);

        return () => controller.abort();
    }, []);

    return <WtalPanorama stars={stars} />;
};
