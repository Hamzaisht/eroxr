
import { BackgroundEffects } from "./sections/BackgroundEffects";
import { Hero3D } from "./Hero3D";
import { motion } from "framer-motion";
import { MouseParallax } from "./components/MouseParallax";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden">
      <BackgroundEffects />
      <MouseParallax className="absolute inset-0 z-0">
        <div className="absolute right-5 top-10 w-64 h-64 bg-luxury-primary/10 rounded-full filter blur-3xl" />
        <div className="absolute left-1/3 bottom-40 w-96 h-96 bg-luxury-accent/10 rounded-full filter blur-3xl" />
      </MouseParallax>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto max-w-[1440px] min-h-screen px-6 xl:px-8 relative z-10 flex items-center justify-center"
      >
        <Hero3D />
      </motion.div>
    </section>
  );
};

export default HeroSection;
