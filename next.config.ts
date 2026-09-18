import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages (jothiswaroop.com).
 * - output: "export" → plain HTML/CSS/JS in ./out, no server
 * - images.loader → build-time WebP variants (scripts/images.mjs) served from /img/_w; Pages has no optimizer
 * - trailingSlash → /about/ resolves to /about/index.html on Pages
 * When the application → CRM endpoint is added, it must live off-site (edge function); Pages cannot run it.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    deviceSizes: [384, 640, 960, 1280, 1920],
    imageSizes: [384, 640],
  },
};

export default nextConfig;
