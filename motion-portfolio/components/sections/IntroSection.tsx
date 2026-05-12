"use client";

import { motion } from "motion/react";
import { ArrowRight, CodeXml } from "lucide-react";

const SOURCE_CODE_URL = "https://github.com/KR1SH9A/Motion";
const PROJECTS_URL = "https://dotogether.purpl.online/";

// Reveal each line of intro copy with a subtle stagger. The intro is the very
// first thing painted, so durations are short — we want it to feel instant,
// not animated for its own sake.
const lineVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: 0.08 + i * 0.07,
    },
  }),
};

export function IntroSection() {
  return (
    <section
      id="intro"
      aria-labelledby="intro-heading"
      className="relative flex min-h-screen w-full items-center bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-32 md:py-40">
        <div className="flex flex-col items-start gap-6">
          <motion.span
            custom={0}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft px-3 py-1 text-xs font-medium tracking-[0.18em] text-brand uppercase backdrop-blur-md"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            KR1SH9A
          </motion.span>

          <motion.h1
            id="intro-heading"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="text-balance font-heading text-6xl font-semibold tracking-tight text-foreground sm:text-7xl md:text-[clamp(5rem,9vw,9rem)]"
            style={{ letterSpacing: "-0.04em", lineHeight: 0.95 }}
          >
            Motion
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="max-w-2xl text-balance text-lg leading-relaxed text-foreground/65 md:text-xl"
          >
            A playground to showcase my scroll animations. Built with Next.js,
            GSAP ScrollTrigger, Motion, Lenis, and a high-performance canvas
            image sequence renderer.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="mt-2 flex flex-wrap items-center gap-3"
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
              href="#example"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/90 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-foreground/[0.04] focus-visible:outline-2 focus-visible:outline-foreground/40 focus-visible:outline-offset-2"
            >
              See it scroll
              <ArrowRight
                className="size-4 -rotate-90 transition-transform group-hover:translate-y-0.5"
                aria-hidden
              />
            </a>
            <a
              href={SOURCE_CODE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-3 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground/40 focus-visible:outline-offset-2"
            >
              <CodeXml className="size-4" aria-hidden />
              Source Code
            </a>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="mt-10 flex items-center gap-3 text-xs tracking-[0.18em] text-foreground/55 uppercase"
          >
            <span className="h-px w-8 bg-brand" />
            <span className="text-brand">Scroll for the demo</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
