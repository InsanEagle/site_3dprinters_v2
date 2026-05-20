import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn1.ozone.ru",
        pathname: "/s3/**"
      }
    ]
  }
};

export default nextConfig;
