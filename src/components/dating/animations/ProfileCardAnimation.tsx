
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import { DatingAd } from "@/components/ads/types/dating";
import { PropsWithChildren } from "react";

interface ProfileCardAnimationProps extends PropsWithChildren {
  delay?: number;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const ProfileCardAnimation = ({ 
  children, 
  delay = 0, 
  className,
  onClick,
  isActive 
}: ProfileCardAnimationProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ 
        scale: isMobile ? 1 : 1.03, 
        y: isMobile ? 0 : -5 
      }}
      transition={{ 
        duration: 0.3, 
        delay: delay * 0.1,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className={cn(
        "relative transition-all duration-300",
        isActive && "ring-2 ring-luxury-primary/50 ring-offset-1 ring-offset-luxury-dark",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Special animation for match highlight effects
export const MatchHighlightAnimation = ({ children }: PropsWithChildren) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 1, 0.8, 1],
        scale: [0.95, 1.05, 1]
      }}
      transition={{ 
        duration: 0.8,
        times: [0, 0.4, 0.7, 1] 
      }}
      className="absolute inset-0 z-10 pointer-events-none"
    >
      {children}
    </motion.div>
  );
};
