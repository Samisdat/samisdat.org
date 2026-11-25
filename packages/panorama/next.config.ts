import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // The dev server is also opened from other devices over Tailscale; without this Next.js blocks its scripts there.
    // One wildcard covers one level of the name only, so the tailnet is spelled out.
    allowedDevOrigins: ['*.tailec0ee.ts.net'],
};

export default nextConfig;
