
import { BackgroundEffects } from "./sections/BackgroundEffects";
import { Hero3D } from "./Hero3D";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <BackgroundEffects />
      <div className="container mx-auto max-w-[1400px] relative z-10">
        <Hero3D />
      </div>
    </section>
  );
};

export default HeroSection;
