
import { Suspense, lazy, useRef } from "react";
import { motion, LazyMotion, domAnimation, useInView } from "framer-motion";
import HeroSection from "@/components/landing/HeroSection";
import Footer from "@/components/landing/Footer";
import { SmoothScroll } from "@/components/landing/components/SmoothScroll";

// Lazy load other sections
const Features3D = lazy(() => import("@/components/landing/Features3D"));
const CreatorShowcase = lazy(() => import("@/components/landing/CreatorShowcase"));
const AnimatedStats = lazy(() => import("@/components/landing/AnimatedStats"));
const InteractiveFeatures = lazy(() => import("@/components/landing/InteractiveFeatures"));
const CreatorCategories = lazy(() => import("@/components/landing/sections/CreatorCategories"));
const PlatformPreview = lazy(() => import("@/components/landing/PlatformPreview"));

// Section wrapper with animation
const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Loading placeholder with skeleton UI
const LoadingSection = () => (
  <div className="h-[60vh] lg:h-screen w-full flex items-center justify-center bg-luxury-dark">
    <div className="space-y-8 w-full max-w-4xl mx-auto px-4">
      <div className="h-12 bg-luxury-neutral/10 rounded-lg animate-pulse"></div>
      <div className="h-64 bg-luxury-neutral/10 rounded-lg animate-pulse"></div>
      <div className="h-12 bg-luxury-neutral/10 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

const Landing = () => {
  return (
    <LazyMotion features={domAnimation}>
      <SmoothScroll>
        <div className="min-h-screen w-full bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark text-white">
          {/* Remove container class to allow edge-to-edge design */}
          <motion.div initial={{ opacity: 1 }} className="w-full">
            <HeroSection />
          </motion.div>

          {/* Content Sections */}
          <div className="w-full">
            {/* Stats Section */}
            <Suspense fallback={<LoadingSection />}>
              <AnimatedSection>
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
      </SmoothScroll>
    </LazyMotion>
  );
};

export default Landing;
