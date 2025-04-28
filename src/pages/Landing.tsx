
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useParallax } from "@/hooks/use-parallax";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { useIsMobile } from "@/hooks/use-mobile";

import { Navbar } from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ExplainerSection } from "@/components/landing/ExplainerSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { MegaCTASection } from "@/components/landing/MegaCTASection";
import BackgroundEffects from "@/components/layout/BackgroundEffects";
import CustomCursor from "@/components/landing/components/CustomCursor";
import "../styles/animations.css";
import { LoadingState } from "@/components/ui/LoadingState";
import { StickySignupCTA } from "@/components/landing/components/StickySignupCTA";
import { ScrollProgress } from "@/components/landing/components/ScrollProgress";
import { ThemeToggle } from "@/components/landing/components/ThemeToggle";
import CSSParticlesBackground from "@/components/landing/CSSParticlesBackground";
import { throttle } from "@/utils/throttle";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Lazy load non-critical components
const ROICalculator = lazy(() => import("@/components/landing/components/ROICalculator"));
const PressLogos = lazy(() => import("@/components/landing/components/PressLogos"));
const SuccessStoriesCarousel = lazy(() => import("@/components/landing/components/SuccessStoriesCarousel"));
const CommunityHighlights = lazy(() => import("@/components/landing/components/CommunityHighlights"));
const FeatureComparisonTable = lazy(() => import("@/components/landing/components/FeatureComparisonTable"));
const FAQSection = lazy(() => import("@/components/landing/components/FAQSection"));

// Pre-load critical images
const preloadImages = [
  "/logo-glow.png",
  "/grid.svg",
];

const Landing = () => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
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
    
    // Preload critical images
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    // Enable smooth scrolling behavior
    document.documentElement.style.scrollBehavior = prefersReducedMotion ? "auto" : "smooth";
    
    // Add performance optimization
    const handleScroll = throttle(() => {
      // No-op, just for event throttling
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  if (!mounted) return <LoadingState message="Initializing..." />;

  return (
    <div className="relative w-screen overflow-x-hidden bg-luxury-dark text-white">
      {/* Scroll progress indicator */}
      <ScrollProgress />
      
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-[60]">
        <ThemeToggle />
      </div>
      
      {!isMobile && !prefersReducedMotion && <CustomCursor />}
      
      <BackgroundEffects />
      
      <Navbar />
      
      {/* Sticky CTA that appears after scrolling */}
      <StickySignupCTA />
      
      <motion.main 
        ref={mainRef}
        className="relative w-screen"
        style={{
          scale: prefersReducedMotion ? 1 : scrollProgressScale,
          boxShadow: prefersReducedMotion ? "none" : scrollProgressBorder,
        }}
      >
        <HeroSection scrollOpacity={opacity} />
        
        <Suspense fallback={<div className="py-12 flex justify-center"><LoadingState /></div>}>
          <PressLogos />
        </Suspense>
        
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
            
            <Suspense fallback={<div className="h-96 flex justify-center items-center"><LoadingState /></div>}>
              <ROICalculator />
            </Suspense>
          </div>
        </section>
        
        <FeaturesSection />
        
        <TrustSection />
        
        <TestimonialsSection />
        
        <PricingSection />
        
        <Suspense fallback={<div className="py-12 flex justify-center"><LoadingState /></div>}>
          <SuccessStoriesCarousel />
        </Suspense>
        
        <Suspense fallback={<div className="py-12 flex justify-center"><LoadingState /></div>}>
          <CommunityHighlights />
        </Suspense>
        
        <Suspense fallback={<div className="py-12 flex justify-center"><LoadingState /></div>}>
          <FeatureComparisonTable />
        </Suspense>
        
        <Suspense fallback={<div className="py-12 flex justify-center"><LoadingState /></div>}>
          <FAQSection />
        </Suspense>
        
        <MegaCTASection />
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Landing;
