import { HoverGrid, type HoverGridItem } from "@/components/ui/aceternity/HoverGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

const EXPERIMENTS: HoverGridItem[] = [
  {
    badge: "Shipped",
    title: "Scroll-driven hero sequence",
    description:
      "A pinned canvas plays back 162 WebP frames at 60fps as you scroll the page.",
  },
  {
    badge: "Coming soon",
    title: "WebGL parallax fields",
    description:
      "Layered depth-of-field driven by pointer + scroll position, GPU-only.",
  },
  {
    badge: "Coming soon",
    title: "Type that breathes",
    description:
      "Variable-font weight and tracking lerped to scroll progress with Lenis.",
  },
  {
    badge: "Coming soon",
    title: "Magnetic cursor & buttons",
    description:
      "Pointer-following affordances with spring physics, motion/react driven.",
  },
  {
    badge: "Coming soon",
    title: "Section transitions",
    description:
      "Crossfade + scale page chapters using React 19 View Transitions.",
  },
  {
    badge: "Coming soon",
    title: "Audio-reactive canvas",
    description:
      "AnalyserNode amplitude piped into a custom 2D shader for ambient visuals.",
  },
];

export function ShowcaseSection() {
  return (
    <section
      id="showcase"
      className="relative w-full bg-background py-28 md:py-36"
      aria-labelledby="showcase-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="Showcase"
          title="More experiments incoming"
          description="A growing collection of scroll, pointer, and time-based motion studies."
        />

        <div className="mt-14">
          <HoverGrid items={EXPERIMENTS} />
        </div>
      </div>
    </section>
  );
}
