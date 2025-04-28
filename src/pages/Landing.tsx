
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
import { ROICalculator } from "@/components/landing/components/ROICalculator";
import { PressLogos } from "@/components/landing/components/PressLogos";
import { SuccessStoriesCarousel } from "@/components/landing/components/SuccessStoriesCarousel";
import { CommunityHighlights } from "@/components/landing/components/CommunityHighlights";
import { FeatureComparisonTable } from "@/components/landing/components/FeatureComparisonTable";
import { FAQSection } from "@/components/landing/components/FAQSection";
import { StickySignupCTA } from "@/components/landing/components/StickySignupCTA";

const Landing = () => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0.2]);
  
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
    
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-screen overflow-x-hidden bg-luxury-dark text-white">
      {!isMobile && <CustomCursor />}
      
      <BackgroundEffects />
      
      <Navbar />
      
      {/* Sticky CTA that appears after scrolling */}
      <StickySignupCTA />
      
      <motion.main 
        ref={mainRef}
        className="relative w-screen"
        style={{
          scale: scrollProgressScale,
          boxShadow: scrollProgressBorder,
        }}
      >
        <HeroSection scrollOpacity={opacity} />
        
        <PressLogos />
        
        <ExplainerSection />
        
        <section className="py-24 px-4 sm:px-6">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                Calculate Your <span className="gradient-text">Earning Potential</span>
              </h2>
              <p className="text-luxury-neutral/80 max-w-2xl mx-auto text-lg">
                See how much you could earn on EROXR with our interactive calculator
              </p>
            </motion.div>
            <ROICalculator />
          </div>
        </section>
        
        <CreatorShowcase />
        
        <FeaturesSection />
        
        <TrustSection />
        
        <TestimonialsSection />
        
        <PricingSection />
        
        <SuccessStoriesCarousel />
        <CommunityHighlights />
        <FeatureComparisonTable />
        <FAQSection />
        
        <MegaCTASection />
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Landing;
