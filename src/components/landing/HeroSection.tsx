
import { BackgroundEffects } from "./sections/BackgroundEffects";
import { Hero3D } from "./Hero3D";
import { motion } from "framer-motion";
import { MouseParallax } from "./components/MouseParallax";
import { useRef, useEffect, useState } from "react";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { height } = containerRef.current.getBoundingClientRect();
      const scrollPosition = window.scrollY;
      const maxScroll = height - window.innerHeight;
      
      setScrollProgress(Math.min(1, Math.max(0, scrollPosition / maxScroll)));
    };
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen overflow-hidden">
      <BackgroundEffects />
      {!isMobile && (
        <MouseParallax className="absolute inset-0 z-0">
          <div className="absolute right-5 top-10 w-64 h-64 bg-luxury-primary/10 rounded-full filter blur-3xl" />
          <div className="absolute left-1/3 bottom-40 w-96 h-96 bg-luxury-accent/10 rounded-full filter blur-3xl" />
        </MouseParallax>
      )}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full min-h-screen relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <Hero3D />
      </motion.div>
      
      {/* Scroll indicator */}
      {!isMobile && scrollProgress < 0.2 && (
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-luxury-primary/30 flex items-center justify-center"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          >
            <motion.div 
              className="w-1.5 h-1.5 bg-luxury-primary rounded-full"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.15 }}
            />
          </motion.div>
          <p className="text-xs text-luxury-primary/70 mt-2 font-light text-center">Scroll</p>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;
