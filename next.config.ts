import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dz2vogxllkvqq.cloudfront.net",
        pathname: "/products/**",
      },
    ],
  },
};

export default nextConfig;
