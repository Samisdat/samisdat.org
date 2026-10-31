import { SITE_URL } from '@/lib/constants';

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        // Temporär komplett dicht, bis der Blog launch-fertig ist —
        // beim Launch: disallow → allow und noindex in layout.tsx entfernen.
        rules: [
            {
                userAgent: '*',
                disallow: '/',
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
