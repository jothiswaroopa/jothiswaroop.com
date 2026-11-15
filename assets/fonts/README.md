# Fonts used by the build scripts

These files are read by `scripts/blog/og.mjs` (blog share images). The site itself loads its fonts through `next/font`.

| File | Face | Licence | Source |
|---|---|---|---|
| `Besley-SemiBold-latin.ttf`, `Besley-SemiBold-latin-ext.ttf` | Besley 600, by Owen Earl (indestructible type*) | SIL Open Font License 1.1 | Fontsource CDN, `besley`, added 15 Nov 2026 |
| `LibreFranklin-SemiBold-latin.ttf`, `LibreFranklin-SemiBold-latin-ext.ttf` | Libre Franklin 600, by Impallari Type | SIL Open Font License 1.1 | Fontsource CDN, `libre-franklin`, added 15 Nov 2026 |

Notes:

- The files are static subsets. Satori keeps one font per family name, weight and style, so each subset is registered under its own name in `og.mjs`.
- Besley has no rupee sign. The Libre Franklin latin-ext file supplies it.
- Instrument Serif, Geist, Geist Mono and Archivo Black are still used by the Fiverr, LinkedIn and blog-cover scripts.
