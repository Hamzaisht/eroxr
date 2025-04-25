import { Suspense, lazy, useRef, useEffect, useState } from "react";
import { motion, LazyMotion, domAnimation, useInView } from "framer-motion";
import HeroSection from "@/components/landing/HeroSection";
import Footer from "@/components/landing/Footer";
import { BackgroundEffects } from "@/components/landing/sections/BackgroundEffects";

// Lazy load other sections with error boundaries and retry logic
const lazyImport = (importFn: () => Promise<any>, maxRetries = 2) => {
  return lazy(async () => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await importFn();
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          console.error("Failed to load module after retries:", error);
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    throw new Error("Failed to load module");
  });
};

// Lazy load with retry
const Features3D = lazyImport(() => import("@/components/landing/Features3D"));
const CreatorShowcase = lazyImport(() => import("@/components/landing/CreatorShowcase"));
const AnimatedStats = lazyImport(() => import("@/components/landing/AnimatedStats"));
const InteractiveFeatures = lazyImport(() => import("@/components/landing/InteractiveFeatures"));
const CreatorCategories = lazyImport(() => import("@/components/landing/sections/CreatorCategories"));
const PlatformPreview = lazyImport(() => import("@/components/landing/PlatformPreview"));

// Loading placeholder with skeleton UI
const LoadingSection = () => (
  <div className="h-[40vh] lg:h-[60vh] w-full flex items-center justify-center bg-luxury-dark">
    <div className="space-y-8 w-full max-w-4xl mx-auto px-4">
      <div className="h-12 bg-luxury-neutral/10 rounded-lg animate-pulse"></div>
      <div className="h-64 bg-luxury-neutral/10 rounded-lg animate-pulse"></div>
      <div className="h-12 bg-luxury-neutral/10 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

// Section wrapper with animation
const AnimatedSection = ({ 
  children, 
  className = "",
  priority = false 
}: { 
  children: React.ReactNode, 
  className?: string,
  priority?: boolean 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [shouldLoad, setShouldLoad] = useState(priority);
  
  useEffect(() => {
    const checkPosition = () => {
      if (!ref.current || shouldLoad) return;
      
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Pre-load when section is within 2x viewport height
      if (rect.top < viewportHeight * 2) {
        setShouldLoad(true);
      }
    };
    
    checkPosition();
    window.addEventListener('scroll', checkPosition);
    return () => window.removeEventListener('scroll', checkPosition);
  }, [shouldLoad]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full ${className}`}
    >
      {shouldLoad && children}
      {!shouldLoad && <LoadingSection />}
    </motion.div>
  );
};

const Landing = () => {
  // Track loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Disable scroll restoration during navigation
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Set loading false after initial render
    setIsLoading(false);
    
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen w-full bg-luxury-dark text-white">
        <BackgroundEffects />
        
        {/* Full width hero section */}
        <HeroSection />

        {/* Content Sections */}
        <div className="w-full">
          {/* Stats Section - High priority */}
          <Suspense fallback={<LoadingSection />}>
            <AnimatedSection priority={true}>
              <AnimatedStats />
            </AnimatedSection>
          </Suspense>

          {/* Platform Preview */}
          <Suspense fallback={<LoadingSection />}>
            <AnimatedSection>
              <PlatformPreview />
            </AnimatedSection>
          </Suspense>

          {/* Creator Categories */}
          <Suspense fallback={<LoadingSection />}>
            <AnimatedSection>
              <CreatorCategories />
            </AnimatedSection>
          </Suspense>

          {/* Features Section */}
          <Suspense fallback={<LoadingSection />}>
            <AnimatedSection>
              <Features3D />
            </AnimatedSection>
          </Suspense>

          {/* Creator Showcase */}
          <Suspense fallback={<LoadingSection />}>
            <AnimatedSection>
              <CreatorShowcase />
            </AnimatedSection>
          </Suspense>

          {/* Interactive Features */}
          <Suspense fallback={<LoadingSection />}>
            <AnimatedSection>
              <InteractiveFeatures />
            </AnimatedSection>
          </Suspense>

          {/* Footer */}
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
