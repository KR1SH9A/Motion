# Motion — A playground to showcase my scroll animations · KR1SH9A

A premium single-page portfolio microsite whose centrepiece is a **scroll-driven cinematic animation** built from a 162-frame 1920×1080 WebP sequence rendered onto a single canvas.

Built with **Next.js 16** (App Router, Turbopack), React 19.2, Tailwind v4, GSAP ScrollTrigger, Motion, Lenis, shadcn/ui and an Aceternity-inspired hover grid.

---

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

The first `dev`/`build` runs a `predev`/`prebuild` script that mirrors the 162 source frames from `../source-video/webp/` into `public/frames/`. The mirror is `.gitignore`d — regenerated on demand.

```bash
npm run build    # static export (no SSR runtime)
npm run start    # serve the production bundle
npm run lint     # ESLint flat config (next/core-web-vitals)
```

## Project layout

```
app/
  layout.tsx                Geist fonts, metadata, LenisProvider mount
  page.tsx                  HeroSequence + 4 sections + Footer
  globals.css               Tailwind v4 + shadcn tokens + .shadow-premium utilities

components/
  providers/LenisProvider   Lenis ↔ GSAP ticker sync (single RAF loop)
  hero/
    HeroSequence            Pinned section, ScrollTrigger scrub, CTAs
    SequenceCanvas          Single <canvas>, rAF-coalesced drawCover
    SequenceLoader          Bitmap cache + nearest-loaded fallback
  sections/                 TechStack, Metrics, Showcase, Footer
  ui/                       SectionHeading, GradientButton, shadcn primitives,
                            aceternity/HoverGrid (adapted)

lib/
  sequence.ts               Frame URL + cover-fit math (pure, hot-path safe)
  image-loader.ts           createImageBitmap + concurrency-bounded preload
  gsap.ts                   registerPlugin(ScrollTrigger), guarded for SSR
  utils.ts                  shadcn cn() helper

scripts/
  copy-frames.mjs           predev/prebuild asset mirror
```

## Performance notes

- **Single canvas.** No DOM thrash — the page never touches an `<img>` for sequence frames.
- **`createImageBitmap`** off-main-thread decode where supported (every Next 16 target browser). HTMLImageElement fallback path remains for resilience.
- **Concurrency-bounded preload.** 8 priority frames are awaited before scroll-driven playback begins; the remaining 154 stream with 6 parallel decoders.
- **Idempotent draws.** The canvas only redraws when (a) the frame index changes or (b) the loader streams in a closer frame. Resize forces one redraw via `ResizeObserver`. All draws are coalesced through a single `requestAnimationFrame`.
- **One RAF loop.** Lenis is driven by `gsap.ticker`, so there is one shared frame loop across the page — no competing schedulers.
- **DPR capped at 2.** Prevents 4K-on-Retina overdraw without visible quality loss.
- **`prefers-reduced-motion`.** Skips pin/scrub entirely; the hero renders the final frame as a still.
- **Static export.** The build produces fully prerendered HTML (`○ /`) — zero server runtime.

## CTAs

- **View Projects** → <https://dotogether.purpl.online/>
- **Source Code** → <https://github.com/KR1SH9A/Motion>

## Tech stack

Next.js 16 · React 19.2 · TypeScript 5 · Tailwind v4 · GSAP + ScrollTrigger · Motion (motion/react) · Lenis · shadcn/ui (Base UI) · Lucide React · Aceternity-inspired hover grid.
