
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";

const Dating = () => {
  return (
    <div className="min-h-screen bg-luxury-dark">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-20"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-luxury-neutral mb-8">
            Create a BD
          </h1>
          
          <div className="bg-luxury-darker/40 rounded-lg p-6 shadow-lg">
            <p className="text-luxury-neutral">
              This is where you can create your dating profile. Content is coming soon.
            </p>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Dating;
