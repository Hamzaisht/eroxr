import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glow';
  hoverable?: boolean;
}

export const GlassmorphicCard = ({ 
  children, 
  className, 
  variant = 'default',
  hoverable = false 
}: GlassmorphicCardProps) => {
  const baseClasses = "relative overflow-hidden rounded-3xl border border-white/10";
  
  const variantClasses = {
    default: "bg-white/5 backdrop-blur-xl",
    gradient: "bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl",
    glow: "bg-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(139,92,246,0.3)]"
  };

  const hoverClasses = hoverable 
    ? "hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_80px_rgba(139,92,246,0.4)] transition-all duration-500" 
    : "";

  return (
    <motion.div
      className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={hoverable ? { scale: 1.02 } : undefined}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-50 animate-pulse" />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
    </motion.div>
  );
};