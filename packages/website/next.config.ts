import { withWyw } from '@wyw-in-js/nextjs';

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withWyw(nextConfig);
