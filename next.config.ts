import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.awwwards.com",
      },
      {
        protocol: "https",
        hostname: "www.awwwards.com",
      },
    ],
  },
};

export default nextConfig;
