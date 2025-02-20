
import { motion } from "framer-motion";
import { HeroSection } from "@/components/landing/HeroSection";
import { Features3D } from "@/components/landing/Features3D";
import { CreatorShowcase } from "@/components/landing/CreatorShowcase";
import { AnimatedStats } from "@/components/landing/AnimatedStats";
import { InteractiveFeatures } from "@/components/landing/InteractiveFeatures";
import { CreatorCategories } from "@/components/landing/sections/CreatorCategories";

const Landing = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark text-white overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <AnimatedStats />

      {/* Creator Categories */}
      <CreatorCategories />

      {/* Features Section */}
      <Features3D />

      {/* Creator Showcase */}
      <CreatorShowcase />

      {/* Interactive Features */}
      <InteractiveFeatures />
    </div>
  );
};

export default Landing;
