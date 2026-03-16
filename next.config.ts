import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // eslint: {
  //   ignoreDuringBuilds: true, // 빌드 시 ESLint 무시
  // },
  // typescript: {
  //   ignoreBuildErrors: true, // TypeScript 오류도 무시하려면
  // },
  images: {
    remotePatterns: [{ hostname: "example.com" }, { hostname: "snack-s3-bucket-2025.s3.us-west-2.amazonaws.com" }],
  },
};

export default withSentryConfig(nextConfig, {
  org: "de-cal",
  project: "snack-fe",
  silent: !process.env.CI,
  widenClientFileUpload: false,
  disableLogger: true,
  automaticVercelMonitors: false,
});
