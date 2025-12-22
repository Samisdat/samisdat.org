import withLinaria, { LinariaConfig } from 'next-with-linaria';
const nextConfig: LinariaConfig = {
    linaria: {
        fastCheck: true,
    },
    transpilePackages: ['next-mdx-remote'],
};

export default withLinaria(nextConfig);
