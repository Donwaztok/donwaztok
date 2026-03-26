import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/desktop", destination: "/", permanent: true },
      { source: "/desktop/", destination: "/", permanent: true },
      { source: "/politicas", destination: "/policies/", permanent: true },
      { source: "/politicas/", destination: "/policies/", permanent: true },
    ];
  },
};

export default nextConfig;
