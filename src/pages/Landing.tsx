
import { motion } from "framer-motion";
import { HeroSection } from "@/components/landing/HeroSection";
import { Features3D } from "@/components/landing/Features3D";
import { CreatorShowcase } from "@/components/landing/CreatorShowcase";
import { AnimatedStats } from "@/components/landing/AnimatedStats";
import { InteractiveFeatures } from "@/components/landing/InteractiveFeatures";
import { CreatorCategories } from "@/components/landing/sections/CreatorCategories";

const Landing = () => {
  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark text-white overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 1 }}
        style={{ willChange: 'transform' }}
      >
        <HeroSection />
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 1 }}
        style={{ willChange: 'transform' }}
      >
        <AnimatedStats />
      </motion.div>

      {/* Creator Categories */}
      <motion.div
        initial={{ opacity: 1 }}
        style={{ willChange: 'transform' }}
      >
        <CreatorCategories />
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 1 }}
        style={{ willChange: 'transform' }}
      >
        <Features3D />
      </motion.div>

      {/* Creator Showcase */}
      <motion.div
        initial={{ opacity: 1 }}
        style={{ willChange: 'transform' }}
      >
        <CreatorShowcase />
      </motion.div>

      {/* Interactive Features */}
      <motion.div
        initial={{ opacity: 1 }}
        style={{ willChange: 'transform' }}
      >
        <InteractiveFeatures />
      </motion.div>
    </div>
  );
};

export default Landing;
