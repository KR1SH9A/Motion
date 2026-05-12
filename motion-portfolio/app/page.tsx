import { Footer } from "@/components/sections/Footer";
import { IntroSection } from "@/components/sections/IntroSection";
import { MetricsSection } from "@/components/sections/MetricsSection";
import { ScrollExampleSection } from "@/components/sections/ScrollExampleSection";
import { ShowcaseSection } from "@/components/sections/ShowcaseSection";
import { TechStackSection } from "@/components/sections/TechStackSection";

export default function Home() {
  return (
    <main className="relative w-full overflow-hidden">
      <IntroSection />
      <ScrollExampleSection />
      <TechStackSection />
      <MetricsSection />
      <ShowcaseSection />
      <Footer />
    </main>
  );
}
