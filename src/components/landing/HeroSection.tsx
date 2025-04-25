
import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hero3D } from "./Hero3D";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { HeroNavigation } from "./components/HeroNavigation";
import { HeroContent } from "./components/HeroContent";

export const HeroSection = memo(() => {
  const [ref, isInView] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  
  return (
    <section 
      ref={ref}
      className="relative w-full h-screen flex items-center overflow-hidden"
    >
      {/* Hero background with 3D elements */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div 
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <Hero3D isActive={isInView} />
        </motion.div>
      </div>

      {/* Navigation */}
      <HeroNavigation headerBg={useTransform(scrollY, [0, 100], ["rgba(13, 17, 23, 0)", "rgba(13, 17, 23, 0.9)"])} />

      {/* Hero Content */}
      <motion.div 
        style={{ opacity, scale, y }}
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8 flex items-center"
      >
        <HeroContent />
      </motion.div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
