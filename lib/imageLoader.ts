"use client";

/**
 * next/image loader for the static export: points at the WebP variants scripts/images.mjs generates
 * under /img/_w/. Anything outside /img/ (remote posters, the OG image) is returned untouched.
 */
const WIDTHS = [384, 640, 960, 1280, 1920];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const m = /^\/img\/([^/]+)\.(jpe?g|png)$/i.exec(src);
  if (!m) return src;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `/img/_w/${m[1]}-${w}.webp`;
}
