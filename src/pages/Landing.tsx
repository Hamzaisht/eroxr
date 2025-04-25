
import { useEffect, useState } from "react";
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

const Landing = () => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0.2]);
  
  useEffect(() => {
    setMounted(true);
    
    // Preload critical assets
    const preloadImages = [
      "/creator-1.jpg",
      "/creator-2.jpg",
      "/creator-3.jpg",
      "/logo-glow.png",
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full bg-luxury-dark text-white overflow-x-hidden">
      <BackgroundEffects />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="relative w-full">
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
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
