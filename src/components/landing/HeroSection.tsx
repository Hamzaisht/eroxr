
import { BackgroundEffects } from "./sections/BackgroundEffects";
import { Hero3D } from "./Hero3D";
import { useMediaQuery } from "@/hooks/use-mobile";

export const HeroSection = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <section className={`relative min-h-screen overflow-hidden ${isMobile ? 'px-4' : 'px-6'}`}>
      <BackgroundEffects />
      <Hero3D />
    </section>
  );
};

export default HeroSection;
