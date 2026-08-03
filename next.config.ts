import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "snack-s3-production.s3.us-west-2.amazonaws.com",
        pathname: "/products/**",
      },
    ],
  },
};

export default nextConfig;
