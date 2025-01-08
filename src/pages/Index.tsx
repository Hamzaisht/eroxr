import { MainNav } from "@/components/MainNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { Features3D } from "@/components/landing/Features3D";
import { AnimatedStats } from "@/components/landing/AnimatedStats";
import { CreatorShowcase } from "@/components/landing/CreatorShowcase";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { NordicMap } from "@/components/landing/sections/NordicMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-luxury-dark">
      <MainNav />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <NordicMap />
        <div className="relative z-10">
          <HeroSection />
          <AnimatedStats />
          <Features3D />
          <CreatorShowcase />
          <FeaturesSection />
          <CTASection />
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Index;