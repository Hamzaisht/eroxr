
import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hero3D } from "./Hero3D";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { HeroNavigation } from "./components/HeroNavigation";
import { HeroContent } from "./components/HeroContent";
import { HeroFeaturePreview } from "./components/HeroFeaturePreview";

export const EnhancedHeroSection = memo(() => {
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
      {/* Background layers */}
      <div className="absolute inset-0 w-full h-full">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark" />
        
        {/* Grid texture */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        
        {/* Animated background elements */}
        <motion.div 
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <Hero3D isActive={isInView} />
        </motion.div>
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-luxury-dark/50 to-luxury-dark/80" />
        
        {/* Subtle glow accents */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(181, 99, 255, 0.15) 0%, rgba(181, 99, 255, 0) 70%)",
          }}
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Navigation */}
      <HeroNavigation headerBg={useTransform(scrollY, [0, 100], ["rgba(13, 17, 23, 0)", "rgba(13, 17, 23, 0.9)"])} />

      {/* Content Container */}
      <motion.div 
        style={{ opacity, scale, y }}
        className="relative z-10 w-full px-6 sm:px-8 lg:px-12 mx-auto max-w-[1440px]"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column - Hero Content */}
          <HeroContent />
          
          {/* Right column - Feature Preview */}
          <div className="hidden lg:flex">
            <HeroFeaturePreview />
          </div>
        </div>
      </motion.div>
    </section>
  );
});

EnhancedHeroSection.displayName = "EnhancedHeroSection";

export default EnhancedHeroSection;
