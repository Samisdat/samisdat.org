import { withWyw } from '@wyw-in-js/nextjs';

const nextConfig = {
    poweredByHeader: false,

    async headers() {
        // CSP: Enforced after testing
        // 'unsafe-inline' for style-src needed for:
        //   - Next.js font CSS variables (--mix on <html>)
        //   - Panorama animation CSS variables (--parallax-x, --scroll, etc.)
        //   - SVG gradient inline styles (stop-color)
        const cspDirectives = [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self'",
            "img-src 'self' data: https:",
            "connect-src 'self' https://sandpack-bundler-*.codesandbox.io",
            "frame-src 'self' https://codesandbox.io https://*.codesandbox.io https://sandpack-*.codesandbox.io",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
        ].join('; ');

        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: cspDirectives,
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), bluetooth=()',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                ],
            },
        ];
    },
};

export default withWyw(nextConfig);
