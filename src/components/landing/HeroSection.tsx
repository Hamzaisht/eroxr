
import { useRef, useEffect, useState, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hero3D } from "./Hero3D";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export const HeroSection = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [elementRef, isInView] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: false
  });

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { height } = containerRef.current.getBoundingClientRect();
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(0, height - viewportHeight);
      
      setScrollProgress(Math.min(1, Math.max(0, scrollPosition / maxScroll)));
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section 
      ref={(node) => {
        // @ts-ignore - combine refs
        containerRef.current = node;
        // @ts-ignore
        elementRef.current = node;
      }} 
      className="relative w-full min-h-screen overflow-hidden"
    >
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
      
      {/* Scroll indicator */}
      {!isMobile && scrollProgress < 0.1 && (
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
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
