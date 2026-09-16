import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site, hero } from "@/lib/content";

// Served as a real .png so GitHub Pages sends image/png (an extensionless file would be octet-stream and social scrapers reject it).
export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

/** Fonts are vendored in assets/fonts so the OG image never depends on network at build time. */
async function loadFont(file: string) {
  try {
    const b = await readFile(join(process.cwd(), "assets", "fonts", file));
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
  } catch {
    return null;
  }
}

/** Shared-link card: portrait right, fact headline left, amber signal. Built at deploy time. */
export async function GET() {
  const [portrait, serif, mono] = await Promise.all([
    readFile(join(process.cwd(), "public", "img", "portrait-hero.jpg")).then((b) => `data:image/jpeg;base64,${b.toString("base64")}`),
    loadFont("instrument-serif.woff"),
    loadFont("geist-mono.woff"),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0c", color: "#f2ede4", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 460, height: 630, display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portrait} alt="" width={460} height={630} style={{ objectFit: "cover", objectPosition: "50% 15%", filter: "grayscale(1) contrast(1.1)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #0a0a0c 0%, rgba(10,10,12,0) 35%)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", width: 760 }}>
          <div style={{ display: "flex", fontFamily: mono ? "Geist Mono" : "monospace", fontSize: 18, letterSpacing: 3, color: "rgba(242,237,228,0.5)" }}>
            {`// ${site.role.toUpperCase()} · ${site.base.toUpperCase()}`}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {hero.headline.map((l, i) => (
              <div key={i} style={{ display: "flex", fontFamily: serif ? "Instrument Serif" : "serif", fontSize: 76, lineHeight: 0.98, letterSpacing: -2, color: i === 0 ? "#ffb020" : "#f2ede4" }}>
                {l}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#ffb020" }} />
            <div style={{ display: "flex", fontFamily: mono ? "Geist Mono" : "monospace", fontSize: 20, letterSpacing: 2, color: "rgba(242,237,228,0.7)" }}>{site.name.toUpperCase()}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(serif ? [{ name: "Instrument Serif", data: serif, weight: 400 as const, style: "normal" as const }] : []),
        ...(mono ? [{ name: "Geist Mono", data: mono, weight: 500 as const, style: "normal" as const }] : []),
      ],
    }
  );
}
