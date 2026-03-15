import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'apod.nasa.gov' },
      { protocol: 'https', hostname: 'stsci-opo.org' },
      { protocol: 'https', hostname: '**.nasa.gov' },
      { protocol: 'https', hostname: '**.esa.int' },
      { protocol: 'https', hostname: 'cdn.esawebb.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.jpl.nasa.gov' },
    ],
  },
};

export default nextConfig;
