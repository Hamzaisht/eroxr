
import { useRef, useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { Hero3D } from "./Hero3D";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export const HeroSection = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementRef, isInView] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: false
  });
  
  return (
    <section 
      ref={(node) => {
        containerRef.current = node;
        // @ts-ignore
        elementRef.current = node;
      }} 
      className="relative min-h-[90vh] w-full overflow-hidden"
    >
      {/* Hero background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <Hero3D isActive={isInView} />
        </motion.div>
      </div>

      {/* Content container with max-width */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="w-full py-12 lg:py-24">
          <HeroContent />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
