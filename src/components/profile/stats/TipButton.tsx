
import { DollarSign, Loader2, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { usePlatformSubscription } from "@/hooks/usePlatformSubscription";

interface TipButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const TipButton = ({ onClick, isLoading }: TipButtonProps) => {
  const { hasPremium } = usePlatformSubscription();

  return (
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      onClick={onClick}
      className={`neo-blur rounded-2xl p-4 flex items-center gap-3 backdrop-blur-lg 
                transition-colors duration-300 cursor-pointer relative
                ${hasPremium 
                  ? "bg-luxury-primary/20 hover:bg-luxury-primary/30" 
                  : "bg-amber-500/20 hover:bg-amber-500/30"
                }
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={isLoading}
      aria-label="Send tip to creator"
    >
      {!hasPremium && (
        <Crown className="h-4 w-4 text-amber-400 absolute -top-1 -right-1" />
      )}
      
      {isLoading ? (
        <Loader2 className="h-5 w-5 text-luxury-primary animate-spin" />
      ) : (
        <DollarSign className={`h-5 w-5 animate-pulse ${hasPremium ? "text-luxury-primary" : "text-amber-400"}`} />
      )}
      <span className="text-white font-medium">
        {hasPremium ? "Send Tip" : "Upgrade to Tip"}
      </span>
    </motion.button>
  );
};
