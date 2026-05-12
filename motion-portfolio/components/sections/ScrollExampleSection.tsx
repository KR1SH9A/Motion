"use client";

import { useEffect, useRef, useState } from "react";

import { SequenceCanvas } from "@/components/hero/SequenceCanvas";
import { SequenceLoader } from "@/components/hero/SequenceLoader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollTrigger } from "@/lib/gsap";
import {
  LAST_FRAME_INDEX,
  TOTAL_FRAMES,
  frameIndexFromProgress,
} from "@/lib/sequence";

/**
 * The scroll-driven canvas example.
 *
 * Structure (top-to-bottom):
 *   1. A normal-flow section heading explaining what this is.
 *   2. A pinned, viewport-height stage that ScrollTrigger pins for 300vh
 *      while mapping scroll progress onto the canvas frame index.
 *
 * The heading is intentionally OUTSIDE the pinned stage so it scrolls past
 * normally, acting as a lead-in. This avoids the previous issue of overlay
 * text colliding with the canvas frame content.
 */
export function ScrollExampleSection() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [loader, setLoader] = useState<SequenceLoader | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect reduced-motion once on mount. Spec: show static frame, skip pin/scrub.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Boot the loader exactly once. Cleanup aborts in-flight fetches and
  // releases bitmap memory (StrictMode-safe in dev).
  useEffect(() => {
    const instance = new SequenceLoader(TOTAL_FRAMES);
    setLoader(instance);

    void instance.start({
      onProgress: (n) => setLoaded(n),
    });

    return () => {
      instance.destroy();
    };
  }, []);

  // Pin the canvas stage for 300vh and drive the frame index from progress.
  // We pin the stage element (not the whole section) so the heading above
  // it flows past naturally before the pin engages.
  useEffect(() => {
    if (!loader || reducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;

    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setFrameIndex(frameIndexFromProgress(self.progress));
      },
    });

    const id = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(id);
      trigger.kill();
    };
  }, [loader, reducedMotion]);

  // When the loader streams a closer frame in, force a redraw so the canvas
  // upgrades from a nearby fallback to the exact requested frame.
  useEffect(() => {
    if (!stageRef.current) return;
    const canvas = stageRef.current.querySelector("canvas");
    canvas?.dispatchEvent(new Event("sequence:redraw"));
  }, [loaded]);

  const displayedIndex = reducedMotion ? LAST_FRAME_INDEX : frameIndex;
  const ready = loaded >= TOTAL_FRAMES;

  return (
    <section
      id="example"
      aria-labelledby="example-heading"
      className="relative w-full bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-6 pt-24 pb-12 md:pt-32 md:pb-16">
        <SectionHeading
          eyebrow="Scroll example"
          title="An example of a scroll animation I made"
          description="A pinned canvas plays back 162 WebP frames as you scroll — decoded once via createImageBitmap, redrawn with cover-fit math, coalesced through a single requestAnimationFrame."
        />
      </div>

      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden bg-background"
      >
        {loader ? (
          <SequenceCanvas loader={loader} frameIndex={displayedIndex} />
        ) : (
          <div className="h-full w-full bg-background" />
        )}

        {/* Soft vignette to give the frame depth without darkening it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.06) 100%)",
          }}
        />

        {/* Minimal corner caption — does not collide with the canvas content. */}
        <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 rounded-full border border-foreground/10 bg-background/85 px-3 py-1 text-[10px] font-medium tracking-[0.18em] text-foreground/55 uppercase backdrop-blur-md">
          {reducedMotion
            ? "Static frame · reduced motion"
            : ready
              ? "Scroll to play"
              : `Loading frames · ${loaded}/${TOTAL_FRAMES}`}
        </div>
      </div>
    </section>
  );
}
