import { BackgroundEffects } from "./sections/BackgroundEffects";
import { HeroContent } from "./sections/HeroContent";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-luxury-dark">
      <BackgroundEffects />
      <HeroContent />
    </section>
  );
};