import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages (jothiswaroop.com).
 * - output: "export" → plain HTML/CSS/JS in ./out, no server
 * - images.unoptimized → next/image emits <img> straight to the file (Pages has no image optimizer)
 * - trailingSlash → /about/ resolves to /about/index.html on Pages
 * When the application → CRM endpoint is added, it must live off-site (edge function); Pages cannot run it.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
