
import { useRef, useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { Hero3D } from "./Hero3D";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { HeroContent } from "./components/HeroContent"; // Import the HeroContent component

export const HeroSection = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementRef, isInView] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: false
  });
  
  // Handle the ref connection in useEffect instead of inline
  useEffect(() => {
    if (containerRef.current) {
      // Set the intersection observer ref to watch our container
      if (elementRef && typeof elementRef === 'object' && 'current' in elementRef) {
        // Only set if elementRef is a mutable ref object
        elementRef.current = containerRef.current;
      }
    }
  }, [elementRef, containerRef.current]);
  
  return (
    <section 
      ref={containerRef} 
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
