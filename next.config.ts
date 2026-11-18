import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // off: with cacheComponents, dev validates the [lang] route with a placeholder lang and notFound() in layout breaks it
  cacheComponents: false,
  partialPrefetching: false,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
