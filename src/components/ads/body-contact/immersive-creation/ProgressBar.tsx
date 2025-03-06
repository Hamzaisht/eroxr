
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
      <motion.div 
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-luxury-primary to-luxury-secondary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      />
    </div>
  );
};
