
import { Suspense, lazy } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { HeroSection } from "@/components/landing/HeroSection";

// Lazy load other sections
const Features3D = lazy(() => import("@/components/landing/Features3D"));
const CreatorShowcase = lazy(() => import("@/components/landing/CreatorShowcase"));
const AnimatedStats = lazy(() => import("@/components/landing/AnimatedStats"));
const InteractiveFeatures = lazy(() => import("@/components/landing/InteractiveFeatures"));
const CreatorCategories = lazy(() => import("@/components/landing/sections/CreatorCategories"));

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
        <motion.div
          initial={{ opacity: 1 }}
        >
          <HeroSection />
        </motion.div>

        {/* Lazy loaded sections */}
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
      </div>
    </LazyMotion>
  );
};

export default Landing;
