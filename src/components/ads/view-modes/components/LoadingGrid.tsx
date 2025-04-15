
import { motion } from "framer-motion";

export const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <motion.div 
          key={item} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-[4/5] rounded-xl overflow-hidden bg-luxury-dark/40 animate-pulse"
        />
      ))}
    </div>
  );
};
