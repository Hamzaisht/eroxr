
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/HeroSection";
import { Features3D } from "@/components/landing/Features3D";
import { CreatorShowcase } from "@/components/landing/CreatorShowcase";
import { AnimatedStats } from "@/components/landing/AnimatedStats";
import { InteractiveFeatures } from "@/components/landing/InteractiveFeatures";
import { Navbar } from "@/components/landing/Navbar";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark text-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <AnimatedStats />

      {/* Features Section */}
      <Features3D />

      {/* Creator Showcase */}
      <CreatorShowcase />

      {/* Interactive Features */}
      <InteractiveFeatures />
    </div>
  );
};
