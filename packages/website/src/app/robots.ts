import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/constants';

const allowIndex = process.env.NEXT_PUBLIC_ALLOW_INDEX === 'true';

export default function robots(): MetadataRoute.Robots {
    return {
        // Launch-Absicherung per Env-Variable — Default: komplett dicht.
        // Beim Launch: NEXT_PUBLIC_ALLOW_INDEX=true setzen.
        rules: [
            {
                userAgent: '*',
                ...(allowIndex ? { allow: '/' } : { disallow: '/' }),
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
