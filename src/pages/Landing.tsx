
import { Suspense, lazy, useEffect, useState } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import EnhancedHeroSection from "@/components/landing/EnhancedHeroSection";
import Footer from "@/components/landing/Footer";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

// Better lazy loading implementation
const LazySection = ({ 
  component: Component,
  fallback = <LoadingState />,
  errorFallback = <ErrorState title="Section Failed to Load" description="Please refresh the page to try again." />
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

// Improved lazy imports with better error handling
const AnimatedStats = lazy(() => import("@/components/landing/AnimatedStats"));
const PlatformPreview = lazy(() => import("@/components/landing/PlatformPreview"));
const CreatorCategories = lazy(() => import("@/components/landing/sections/CreatorCategories"));
const Features3D = lazy(() => import("@/components/landing/Features3D"));
const CreatorShowcase = lazy(() => import("@/components/landing/CreatorShowcase"));
const InteractiveFeatures = lazy(() => import("@/components/landing/InteractiveFeatures"));

// Optimized section wrapper with better loading strategy
const SectionWrapper = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [sectionRef, setRef] = useState(null);

  useEffect(() => {
    if (!sectionRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Preload when approaching viewport
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" } // Load 300px before coming into view
    );
    
    observer.observe(sectionRef);
    return () => observer.disconnect();
  }, [sectionRef]);

  return (
    <div 
      ref={setRef}
      className={`w-full ${className}`}
    >
      {isVisible ? children : <div className="h-64 w-full" />}
    </div>
  );
};

const Landing = () => {
  // Disable scroll restoration during navigation
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // Define common section loading state
  const SectionLoading = () => (
    <div className="w-full py-24">
      <LoadingState message="Loading content..." />
    </div>
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen w-full overflow-x-hidden bg-luxury-dark text-white">
        <BackgroundEffects />
        
        {/* Enhanced hero section - always render immediately */}
        <EnhancedHeroSection />

        {/* Content Sections with optimized loading */}
        <div className="w-full">
          {/* Stats Section - High priority */}
          <SectionWrapper>
            <LazySection 
              component={AnimatedStats}
              fallback={<SectionLoading />}
            />
          </SectionWrapper>

          {/* Platform Preview */}
          <SectionWrapper>
            <LazySection 
              component={PlatformPreview}
              fallback={<SectionLoading />}
            />
          </SectionWrapper>

          {/* Creator Categories */}
          <SectionWrapper>
            <LazySection 
              component={CreatorCategories}
              fallback={<SectionLoading />}
            />
          </SectionWrapper>

          {/* Features Section */}
          <SectionWrapper>
            <LazySection 
              component={Features3D}
              fallback={<SectionLoading />}
            />
          </SectionWrapper>

          {/* Creator Showcase */}
          <SectionWrapper>
            <LazySection 
              component={CreatorShowcase}
              fallback={<SectionLoading />}
            />
          </SectionWrapper>

          {/* Interactive Features */}
          <SectionWrapper>
            <LazySection 
              component={InteractiveFeatures}
              fallback={<SectionLoading />}
            />
          </SectionWrapper>

          {/* Footer - always present */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Footer />
          </motion.div>
        </div>
      </div>
    </LazyMotion>
  );
};

export default Landing;
