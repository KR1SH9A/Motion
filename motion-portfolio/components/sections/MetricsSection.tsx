"use client";

import { animate, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

interface Metric {
  value: number;
  suffix?: string;
  label: string;
  caption: string;
  decimals?: number;
}

const METRICS: Metric[] = [
  { value: 162, label: "Optimised frames", caption: "1920×1080 WebP, streamed lazily." },
  { value: 60, suffix: " FPS", label: "Target framerate", caption: "RAF-coalesced canvas writes." },
  { value: 100, suffix: "%", label: "Canvas rendered", caption: "Zero <img> nodes on screen." },
  { value: 8, suffix: " MB", label: "Total payload", caption: "Below the fold; first paint instant." },
  { value: 90, suffix: "+", label: "Lighthouse score", caption: "Performance, A11y, Best Practices." },
];

function Counter({
  value,
  suffix = "",
  decimals = 0,
  active,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  active: boolean;
}) {
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (latest) =>
    `${latest.toFixed(decimals)}${suffix}`,
  );
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const controls = animate(motionValue, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [active, value, motionValue]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      if (ref.current) ref.current.textContent = latest;
    });
    return () => unsubscribe();
  }, [display]);

  return (
    <span ref={ref} aria-hidden>
      0{suffix}
    </span>
  );
}

export function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="metrics"
      ref={sectionRef}
      className="relative w-full bg-background py-28 md:py-36"
      aria-labelledby="metrics-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="Performance"
          title="Built for buttery 60fps"
          description="Every decision optimises for smooth scroll, low memory, and a clean main thread."
        />

        <dl className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-foreground/10 ring-1 ring-foreground/10 shadow-premium md:grid-cols-3 lg:grid-cols-5">
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className={cn(
                "flex flex-col gap-2 bg-background p-6 md:p-8",
                i === METRICS.length - 1 && "md:col-span-3 lg:col-span-1",
              )}
            >
              <dt className="text-xs font-medium tracking-[0.16em] text-foreground/45 uppercase">
                {m.label}
              </dt>
              <dd className="font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                <Counter
                  value={m.value}
                  suffix={m.suffix}
                  decimals={m.decimals}
                  active={inView}
                />
              </dd>
              <p className="text-sm text-foreground/55">{m.caption}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
