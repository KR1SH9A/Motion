"use client";

import { motion } from "motion/react";
import {
  Boxes,
  Film,
  MousePointer2,
  Sparkles,
  Waves,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STACK = [
  {
    title: "Next.js 16",
    description:
      "App Router, React Server Components, Turbopack-by-default builds, and metadata baked in.",
    Icon: Boxes,
  },
  {
    title: "GSAP ScrollTrigger",
    description:
      "Frame-accurate pinning and scrub controls drive the hero canvas with sub-pixel precision.",
    Icon: MousePointer2,
  },
  {
    title: "Motion",
    description:
      "Spring-eased overlays, viewport-triggered reveals, and orchestrated section transitions.",
    Icon: Sparkles,
  },
  {
    title: "Lenis",
    description:
      "Inertia-based smooth scrolling, synchronised with GSAP through a single shared ticker.",
    Icon: Waves,
  },
  {
    title: "Canvas Image Sequence",
    description:
      "A single canvas renders 162 decoded WebP frames using cover-fit math and rAF coalescing.",
    Icon: Film,
  },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: i * 0.06,
    },
  }),
};

export function TechStackSection() {
  return (
    <section
      id="tech"
      className="relative w-full bg-background py-28 md:py-36"
      aria-labelledby="tech-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="Animation details"
          title="The stack behind the scroll"
          description="Five technologies, one cohesive runtime — chosen for cinematic motion, predictable timing, and 60fps under load."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map(({ title, description, Icon }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cardVariants}
            >
              <Card className="h-full bg-card/80 ring-foreground/10 shadow-premium transition-shadow hover:shadow-premium-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex size-10 items-center justify-center rounded-xl bg-foreground/[0.04] text-foreground/80">
                      <Icon className="size-5" aria-hidden />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-foreground/60">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-xs tracking-[0.16em] text-foreground/40 uppercase">
                  Engineered for fluid motion
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
