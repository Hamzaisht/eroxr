
import { BackgroundEffects } from "./sections/BackgroundEffects";
import { Hero3D } from "./Hero3D";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden">
      <BackgroundEffects />
      <div className="container mx-auto max-w-[1440px] min-h-screen px-6 xl:px-8 relative z-10 flex items-center justify-center">
        <Hero3D />
      </div>
    </section>
  );
};

export default HeroSection;
