"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { ScrollTrigger, gsap } from "@/lib/gsap";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      // Lenis owns smooth scroll; CSS scroll-behavior must stay 'auto'
      // (and it is by default — we don't set 'smooth' anywhere).
    });

    // Forward every Lenis scroll event to ScrollTrigger so pinned timelines
    // stay perfectly in sync with the smoothed scroll position.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Drive Lenis from gsap.ticker (single shared RAF loop across the app).
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
