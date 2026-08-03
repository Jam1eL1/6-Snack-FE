import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "example.com" },
      { hostname: "https://snack-s3-production.s3.us-west-2.amazonaws.com/products/" },
    ],
  },
};

export default nextConfig;
