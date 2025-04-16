
import { BackgroundEffects } from "./sections/BackgroundEffects";
import { Hero3D } from "./Hero3D";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <BackgroundEffects />
      <Hero3D />
    </section>
  );
};

export default HeroSection;
