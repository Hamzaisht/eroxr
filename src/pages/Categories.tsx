import { CategorySection } from "@/components/CategorySection";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const Categories = () => {
  return (
    <div className="min-h-screen bg-luxury-dark">
      <MainNav />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-20"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-luxury-neutral mb-8">
            Explore Categories
          </h1>
          <CategorySection />
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Categories;