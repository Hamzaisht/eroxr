
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  gradient?: string;
  border?: boolean;
  shadow?: boolean;
}

export const GlassmorphismCard = ({ 
  children, 
  className = "",
  intensity = 'medium',
  gradient = "from-white/10 to-white/5",
  border = true,
  shadow = true
}: GlassmorphismCardProps) => {
  const intensityClasses = {
    light: "backdrop-blur-sm",
    medium: "backdrop-blur-xl",
    heavy: "backdrop-blur-3xl"
  };

  const borderClass = border ? "border border-white/20" : "";
  const shadowClass = shadow ? "shadow-2xl shadow-black/20" : "";
  
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.005 }}
      className={`
        bg-gradient-to-br ${gradient} 
        ${intensityClasses[intensity]} 
        ${borderClass} 
        ${shadowClass}
        rounded-3xl 
        overflow-hidden 
        transition-all 
        duration-500 
        hover:border-white/30 
        hover:shadow-white/10
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
