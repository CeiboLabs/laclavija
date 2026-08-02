import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["10.252.55.141"],
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {
      // Fotos de guitarras (15MB max) + portadas del blog (8MB max) llegan al
      // server via Server Actions. El default de Next es 1MB que corta cualquier
      // subida real de imagen.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
