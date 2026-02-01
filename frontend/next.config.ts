import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@radix-ui/react-icons"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "r2.diogopacheco.com",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;
