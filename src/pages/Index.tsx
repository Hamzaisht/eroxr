import { MainNav } from "@/components/MainNav";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { CategorySection } from "@/components/CategorySection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
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
        <CategorySection />
        <FeaturedCreators />
        <CTASection />
      </motion.main>
      <Footer />
    </div>
  );
};

export default Index;