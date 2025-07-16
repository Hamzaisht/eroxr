import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface LuxuryGlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  intensity?: 'light' | 'medium' | 'heavy';
  glow?: boolean;
  floating?: boolean;
}

export const LuxuryGlassCard = ({ 
  children, 
  className = "",
  variant = 'primary',
  intensity = 'medium',
  glow = true,
  floating = false
}: LuxuryGlassCardProps) => {
  const intensityClasses = {
    light: "backdrop-blur-sm",
    medium: "backdrop-blur-xl",
    heavy: "backdrop-blur-3xl"
  };

  const variantClasses = {
    primary: "bg-gradient-to-br from-white/10 via-white/5 to-transparent border-white/20",
    secondary: "bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-black/20 border-slate-700/30",
    accent: "bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent border-purple-400/20"
  };

  const glowClasses = glow ? "shadow-2xl shadow-black/50" : "";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: floating ? -5 : -2, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className={`
        ${intensityClasses[intensity]} 
        ${variantClasses[variant]}
        ${glowClasses}
        border rounded-3xl
        overflow-hidden
        transition-all 
        duration-500
        relative
        group
        ${className}
      `}
    >
      {/* Luxury shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};