import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // placeholder art is SVG until real photography arrives
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
