
import { Suspense, lazy } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { HeroSection } from "@/components/landing/HeroSection";
import Footer from "@/components/landing/Footer";

// Lazy load other sections
const Features3D = lazy(() => import("@/components/landing/Features3D"));
const CreatorShowcase = lazy(() => import("@/components/landing/CreatorShowcase"));
const AnimatedStats = lazy(() => import("@/components/landing/AnimatedStats"));
const InteractiveFeatures = lazy(() => import("@/components/landing/InteractiveFeatures"));
const CreatorCategories = lazy(() => import("@/components/landing/sections/CreatorCategories"));
const PlatformPreview = lazy(() => import("@/components/landing/PlatformPreview"));

// Loading placeholder
const LoadingSection = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Landing = () => {
  return (
    <LazyMotion features={domAnimation}>
      <div 
        className="min-h-screen w-full bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark text-white overflow-hidden"
      >
        {/* Hero Section - Always loaded immediately */}
        <motion.div initial={{ opacity: 1 }}>
          <HeroSection />
        </motion.div>

        {/* Stats Section */}
        <Suspense fallback={<LoadingSection />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <AnimatedStats />
          </motion.div>
        </Suspense>

        {/* Platform Preview Section */}
        <Suspense fallback={<LoadingSection />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <PlatformPreview />
          </motion.div>
        </Suspense>

        {/* Creator Categories */}
        <Suspense fallback={<LoadingSection />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <CreatorCategories />
          </motion.div>
        </Suspense>

        {/* Features Section */}
        <Suspense fallback={<LoadingSection />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <Features3D />
          </motion.div>
        </Suspense>

        {/* Creator Showcase */}
        <Suspense fallback={<LoadingSection />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <CreatorShowcase />
          </motion.div>
        </Suspense>

        {/* Interactive Features */}
        <Suspense fallback={<LoadingSection />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <InteractiveFeatures />
          </motion.div>
        </Suspense>

        {/* Footer */}
        <Footer />
      </div>
    </LazyMotion>
  );
};

export default Landing;
