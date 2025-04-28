
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useParallax } from "@/hooks/use-parallax";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { useIsMobile } from "@/hooks/use-mobile";

import { Navbar } from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ExplainerSection } from "@/components/landing/ExplainerSection";
import { CreatorShowcase } from "@/components/landing/CreatorShowcase";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { MegaCTASection } from "@/components/landing/MegaCTASection";
import BackgroundEffects from "@/components/layout/BackgroundEffects";
import CustomCursor from "@/components/landing/components/CustomCursor";
import "../styles/animations.css";

const Landing = () => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0.2]);
  
  // Advanced scroll effects
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });
  
  const scrollProgressScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const scrollProgressBorder = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [
      "0px 0px 0px rgba(155, 135, 245, 0)",
      "0px 30px 60px rgba(155, 135, 245, 0.15)",
      "0px 30px 60px rgba(217, 70, 239, 0.15)",
      "0px 0px 0px rgba(217, 70, 239, 0)"
    ]
  );
  
  useEffect(() => {
    setMounted(true);
    
    // Preload critical assets
    const preloadImages = [
      "/creator-1.jpg",
      "/creator-2.jpg",
      "/creator-3.jpg",
      "/logo-glow.png",
      "/grid.svg",
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    // Apply smooth scrolling with enhanced physics
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-screen overflow-x-hidden bg-luxury-dark text-white">
      {/* Custom cursor effect */}
      {!isMobile && <CustomCursor />}
      
      {/* Enhanced background effects */}
      <BackgroundEffects />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <motion.main 
        ref={mainRef}
        className="relative w-screen"
        style={{
          scale: scrollProgressScale,
          boxShadow: scrollProgressBorder,
        }}
      >
        {/* Hero Section */}
        <HeroSection scrollOpacity={opacity} />
        
        {/* Explainer Section */}
        <ExplainerSection />
        
        {/* Creator Showcase */}
        <CreatorShowcase />
        
        {/* Features Overview */}
        <FeaturesSection />
        
        {/* Trust Section */}
        <TrustSection />
        
        {/* Testimonials */}
        <TestimonialsSection />
        
        {/* Pricing Teaser */}
        <PricingSection />
        
        {/* Final CTA */}
        <MegaCTASection />
      </motion.main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
