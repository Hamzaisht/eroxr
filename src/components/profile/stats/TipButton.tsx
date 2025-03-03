
import { DollarSign, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface TipButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const TipButton = ({ onClick, isLoading }: TipButtonProps) => {
  return (
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      onClick={onClick}
      className={`neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-primary/20 backdrop-blur-lg 
                transition-colors duration-300 hover:bg-luxury-primary/30 cursor-pointer
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={isLoading}
      aria-label="Send tip to creator"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 text-luxury-primary animate-spin" />
      ) : (
        <DollarSign className="h-5 w-5 text-luxury-primary animate-pulse" />
      )}
      <span className="text-white font-medium">Send Tip</span>
    </motion.button>
  );
};
