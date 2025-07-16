import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Luxury3DButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  glow?: boolean;
}

export const Luxury3DButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = "",
  glow = true
}: Luxury3DButtonProps) => {
  const variantClasses = {
    primary: `
      bg-gradient-to-br from-purple-600/80 via-purple-500/60 to-cyan-500/40
      border border-purple-400/30
      text-white font-medium
      shadow-lg shadow-purple-500/25
      hover:from-purple-500/90 hover:via-purple-400/70 hover:to-cyan-400/50
      hover:shadow-xl hover:shadow-purple-400/40
      active:scale-95
    `,
    secondary: `
      bg-gradient-to-br from-slate-700/60 via-slate-600/40 to-slate-800/60
      border border-slate-500/30
      text-white/90 font-medium
      shadow-lg shadow-black/25
      hover:from-slate-600/70 hover:via-slate-500/50 hover:to-slate-700/70
      hover:shadow-xl hover:shadow-black/40
      active:scale-95
    `,
    ghost: `
      bg-white/5
      border border-white/10
      text-white/70 font-medium
      backdrop-blur-xl
      hover:bg-white/10 hover:text-white
      hover:border-white/20
      active:scale-95
    `,
    danger: `
      bg-gradient-to-br from-red-600/80 via-red-500/60 to-pink-500/40
      border border-red-400/30
      text-white font-medium
      shadow-lg shadow-red-500/25
      hover:from-red-500/90 hover:via-red-400/70 hover:to-pink-400/50
      hover:shadow-xl hover:shadow-red-400/40
      active:scale-95
    `
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
    icon: "p-3 rounded-2xl"
  };

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed pointer-events-none" 
    : "cursor-pointer";

  const glowClasses = glow && !disabled 
    ? "hover:shadow-2xl transition-all duration-300" 
    : "";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        transition: { type: "spring", stiffness: 600, damping: 30 }
      }}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${glowClasses}
        backdrop-blur-xl
        transition-all duration-300
        relative overflow-hidden
        group
        ${className}
      `}
    >
      {/* Luxury shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};