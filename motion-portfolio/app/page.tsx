import { Footer } from "@/components/sections/Footer";
import { HeroSequence } from "@/components/hero/HeroSequence";
import { MetricsSection } from "@/components/sections/MetricsSection";
import { ShowcaseSection } from "@/components/sections/ShowcaseSection";
import { TechStackSection } from "@/components/sections/TechStackSection";

export default function Home() {
  return (
    <main className="relative w-full overflow-hidden">
      <HeroSequence />
      <TechStackSection />
      <MetricsSection />
      <ShowcaseSection />
      <Footer />
    </main>
  );
}
