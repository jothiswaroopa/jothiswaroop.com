# Jothi Swaroop — personal brand site

Next.js 16 · Tailwind v4 · Framer Motion · Lenis · GSAP

```bash
npm run dev      # http://localhost:3000
npm run build
```

- **All copy** lives in `lib/content.ts`. Anything tagged `placeholder: true` is invented and must be replaced from `docs/CONTENT-INTAKE.md` before launch.
- **Spec:** `docs/SITE-STRUCTURE.md` (v3.1 — the audited build spec).
- **Placeholder art:** `public/img/*.svg` — swap for real photography/screenshots (jpg/webp) and update paths in `lib/content.ts`; then remove `dangerouslyAllowSVG` from `next.config.ts`.
- **Pending wiring:** calendar link (`site.calendar`), email (`site.email`), CRM POST + 60-second WhatsApp follow-up (see `components/ApplyForm.tsx`), audit email delivery (`components/AuditForm.tsx`), external proof links (`externalProof`).
