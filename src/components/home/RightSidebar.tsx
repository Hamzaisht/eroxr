import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import { SuggestedCreators } from "./SuggestedCreators";

export const RightSidebar = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 sticky top-4 h-[calc(100vh-2rem)] hidden lg:block"
    >
      <div className="rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-6 shadow-lg backdrop-blur-lg">
        <SearchBar />
        <div className="mt-8">
          <SuggestedCreators />
        </div>
      </div>
    </motion.div>
  );
};