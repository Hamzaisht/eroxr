
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  animate?: boolean;
  children?: React.ReactNode;
}

export const SkeletonLoader = ({
  className,
  width = "100%",
  height = "100%",
  animate = true,
  children
}: SkeletonLoaderProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-md bg-gradient-to-r from-luxury-primary/5 via-luxury-accent/5 to-luxury-primary/5",
        className
      )}
      style={{ width, height }}
    >
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent will-change-transform"
          animate={{ 
            x: ["calc(-100% - 100px)", "calc(100% + 100px)"] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "linear",
            repeatDelay: 0.5
          }}
        />
      )}
      
      {children}
    </div>
  );
};
