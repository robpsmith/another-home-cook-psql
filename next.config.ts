import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'x3pwbrfxjezak22a.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
