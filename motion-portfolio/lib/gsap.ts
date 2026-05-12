/**
 * Single entry point for GSAP + ScrollTrigger.
 *
 * Why centralised:
 *   - `gsap.registerPlugin` is a global side-effect; we want it to fire exactly once.
 *   - SSR safety: ScrollTrigger touches `window`, so guard on the client.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
