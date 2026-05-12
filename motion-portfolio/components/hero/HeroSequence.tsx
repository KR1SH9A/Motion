"use client";

import { ArrowRight, CodeXml } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  LAST_FRAME_INDEX,
  TOTAL_FRAMES,
  frameIndexFromProgress,
} from "@/lib/sequence";

import { SequenceCanvas } from "./SequenceCanvas";
import { SequenceLoader } from "./SequenceLoader";

const SOURCE_CODE_URL = "https://github.com/KR1SH9A/Motion";
const PROJECTS_URL = "https://dotogether.purpl.online/";

export function HeroSequence() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
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

  // Wire ScrollTrigger only after the loader is available. The trigger
  // pins the section for 300vh and maps progress → frame index.
  useEffect(() => {
    if (!loader || reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
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

    // Force a refresh once mounted so the trigger picks up the latest layout.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(id);
      trigger.kill();
    };
  }, [loader, reducedMotion]);

  // After the loader streams more frames in, force a canvas redraw so the
  // currently-visible frame upgrades to its higher-fidelity decoded source
  // (instead of staying on the nearest-loaded neighbour).
  useEffect(() => {
    if (!stageRef.current) return;
    const canvas = stageRef.current.querySelector("canvas");
    canvas?.dispatchEvent(new Event("sequence:redraw"));
  }, [loaded]);

  // Animate hero overlay text in on mount with a subtle reveal.
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-reveal]", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // For reduced-motion users, freeze on the final frame so the still image
  // still conveys the ending of the cinematic.
  const displayedIndex = reducedMotion ? LAST_FRAME_INDEX : frameIndex;

  return (
    <section
      ref={sectionRef}
      aria-label="Hero animation"
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      <div
        ref={stageRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative h-full w-full">
          {loader ? (
            <SequenceCanvas loader={loader} frameIndex={displayedIndex} />
          ) : (
            <div className="h-full w-full bg-background" />
          )}
          {/* Soft vignette to add depth without darkening the frame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.06) 100%)",
            }}
          />
        </div>
      </div>

      {/* Overlay UI */}
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        <div className="flex-1" />
        <div className="mx-auto w-full max-w-6xl px-6 pb-16 md:pb-24">
          <div className="flex flex-col items-start gap-6">
            <span
              data-hero-reveal
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-1 text-xs font-medium tracking-[0.18em] text-foreground/70 uppercase backdrop-blur-md"
            >
              <span className="size-1.5 rounded-full bg-foreground/60" />
              KR1SH9A
            </span>
            <h1
              data-hero-reveal
              className="text-balance font-heading text-6xl font-semibold tracking-tight text-foreground sm:text-7xl md:text-[clamp(5rem,9vw,9rem)]"
              style={{ letterSpacing: "-0.04em", lineHeight: 0.95 }}
            >
              Motion
            </h1>
            <p
              data-hero-reveal
              className="max-w-2xl text-balance text-lg leading-relaxed text-foreground/65 md:text-xl"
            >
              A playground to showcase my scroll animations. Built with Next.js,
              GSAP ScrollTrigger, Motion, Lenis, and a high-performance canvas
              image sequence renderer.
            </p>
            <div
              data-hero-reveal
              className="pointer-events-auto mt-2 flex flex-wrap items-center gap-3"
            >
              <a
                href={PROJECTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-premium transition-all hover:translate-y-[-1px] hover:shadow-premium-lg focus-visible:outline-2 focus-visible:outline-foreground/40 focus-visible:outline-offset-2"
              >
                View Projects
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
              <a
                href={SOURCE_CODE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/90 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-foreground/[0.04] focus-visible:outline-2 focus-visible:outline-foreground/40 focus-visible:outline-offset-2"
              >
                <CodeXml className="size-4" aria-hidden />
                Source Code
              </a>
            </div>
            <ScrollHint loaded={loaded} total={TOTAL_FRAMES} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ScrollHint({ loaded, total }: { loaded: number; total: number }) {
  const ready = loaded >= total;
  return (
    <div
      data-hero-reveal
      className="mt-6 flex items-center gap-3 text-xs tracking-[0.18em] text-foreground/45 uppercase"
    >
      <span className="h-px w-8 bg-foreground/20" />
      {ready ? "Scroll to play" : `Loading frames · ${loaded}/${total}`}
    </div>
  );
}
