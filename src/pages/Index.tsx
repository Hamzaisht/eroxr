import { MainNav } from "@/components/MainNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { Features3D } from "@/components/landing/Features3D";
import { AnimatedStats } from "@/components/landing/AnimatedStats";
import { CreatorShowcase } from "@/components/landing/CreatorShowcase";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { SplashScreen } from "@/components/SplashScreen";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-luxury-dark">
      <MainNav />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <AnimatedStats />
        <Features3D />
        <CreatorShowcase />
        <FeaturedCreators />
        <CTASection />
      </motion.main>
      <Footer />
    </div>
  );
};

export default Index;