
import { Suspense } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { HeroSection } from "@/components/landing/HeroSection";
import Footer from "@/components/landing/Footer";
import Features3D from "@/components/landing/Features3D";

// Lazy load other sections
const CreatorShowcase = lazy(() => import("@/components/landing/CreatorShowcase"));
const AnimatedStats = lazy(() => import("@/components/landing/AnimatedStats"));
const InteractiveFeatures = lazy(() => import("@/components/landing/InteractiveFeatures"));
const CreatorCategories = lazy(() => import("@/components/landing/sections/CreatorCategories"));
const PlatformPreview = lazy(() => import("@/components/landing/PlatformPreview"));
const CTASection = lazy(() => import("@/components/CTASection").then(module => ({ default: module.CTASection })));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection").then(module => ({ default: module.FeaturesSection })));

// Add the import for the lazy function since we're no longer importing it as part of Suspense
import { lazy } from "react";

// Loading placeholder with skeleton UI
const LoadingSection = () => (
  <div className="h-screen w-full flex items-center justify-center bg-luxury-dark">
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
      <div className="min-h-screen w-full bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark text-white">
        {/* Hero Section - Immediate Load */}
        <motion.div initial={{ opacity: 1 }}>
          <HeroSection />
        </motion.div>

        {/* Stats Section - Social Proof */}
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

        {/* Features Section */}
        <Suspense fallback={<LoadingSection />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <FeaturesSection />
          </motion.div>
        </Suspense>

        {/* Platform Preview - Show Value */}
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

        {/* Creator Categories - Target Audience */}
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

        {/* Features 3D Section - Benefits - Now directly imported */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Features3D />
        </motion.div>

        {/* Creator Showcase - Social Proof */}
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

        {/* CTA Section */}
        <Suspense fallback={<LoadingSection />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <CTASection />
          </motion.div>
        </Suspense>

        {/* Interactive Features - Engagement */}
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

        {/* Footer with CTAs */}
        <Footer />
      </div>
    </LazyMotion>
  );
};

export default Landing;
