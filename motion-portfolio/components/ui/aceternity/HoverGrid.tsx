"use client";

/**
 * Aceternity-inspired hover grid.
 *
 * Adapted to the white/black palette: a soft neutral wash slides behind the
 * hovered card via `layoutId`, giving the cursor a sense of physical attachment
 * to the cell it's exploring. Cards remain readable at all times — no glow,
 * no neon — matching the Apple/Linear restraint we want here.
 */

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface HoverGridItem {
  title: string;
  description: string;
  badge: string;
}

export function HoverGrid({
  items,
  className,
}: {
  items: readonly HoverGridItem[];
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item, i) => (
        <div
          key={item.title}
          className="relative h-full"
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === i && (
              <motion.span
                aria-hidden
                layoutId="hover-backdrop"
                className="absolute inset-0 rounded-2xl bg-brand-soft ring-1 ring-brand/15"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.18 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.18, delay: 0.05 },
                }}
              />
            )}
          </AnimatePresence>

          <article className="relative z-10 flex h-full flex-col gap-4 rounded-2xl border border-foreground/10 bg-background/80 p-6 backdrop-blur-md shadow-premium transition-shadow group-hover:shadow-premium-lg">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full border border-brand/25 bg-brand-soft px-2.5 py-0.5 text-[10px] font-medium tracking-[0.16em] text-brand uppercase">
                {item.badge}
              </span>
              <span className="text-xs text-foreground/35">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-foreground/60">
              {item.description}
            </p>
          </article>
        </div>
      ))}
    </div>
  );
}
