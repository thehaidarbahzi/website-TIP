import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['192.168.1.15'],
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/a/**")],
  },
};

export default nextConfig;