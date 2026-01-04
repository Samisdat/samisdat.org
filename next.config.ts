import withLinaria, { LinariaConfig } from 'next-with-linaria';
const nextConfig: LinariaConfig = {
    linaria: {
        fastCheck: true,
    },
};

export default withLinaria(nextConfig);
