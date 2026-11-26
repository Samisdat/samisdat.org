import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // The dev server can also be opened from other devices, for example over Tailscale; without this Next.js blocks
    // its scripts there. Set ALLOWED_DEV_ORIGINS to a comma separated list of host names, one wildcard covers one level.
    allowedDevOrigins: (process.env.ALLOWED_DEV_ORIGINS ?? '').split(',').filter(Boolean),
};

export default nextConfig;
