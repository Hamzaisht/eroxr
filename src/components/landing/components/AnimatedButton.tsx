
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glowColor?: string;
  className?: string;
  asLink?: boolean;
  linkHref?: string;
}

export const AnimatedButton = ({ 
  children, 
  variant = "default", 
  size = "md", 
  glowColor = "rgba(155,135,245,0.5)", 
  className,
  asLink = false,
  linkHref = "#",
  ...props
}: AnimatedButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine the appropriate class based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "bg-transparent border border-luxury-primary/50 text-luxury-primary hover:bg-luxury-primary/10";
      case "ghost":
        return "bg-transparent text-white hover:bg-white/10";
      default:
        return "bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white";
    }
  };
  
  // Determine the appropriate sizing class
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-1 text-sm";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-2";
    }
  };
  
  const buttonClasses = cn(
    getVariantClasses(),
    getSizeClasses(),
    "relative rounded-md font-medium overflow-hidden transition-all duration-300",
    className
  );
  
  const buttonContent = (
    <>
      {/* Main content */}
      <span className="relative z-10">{children}</span>
      
      {/* Hover animation overlay */}
      {isHovered && (
        <motion.span 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span 
            className="absolute inset-0 bg-white/10"
            animate={{ 
              boxShadow: [
                `0 0 10px ${glowColor}`,
                `0 0 20px ${glowColor}`,
                `0 0 10px ${glowColor}`
              ]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.span>
      )}
    </>
  );
  
  if (asLink) {
    return (
      <a 
        href={linkHref}
        className={buttonClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {buttonContent}
      </a>
    );
  }
  
  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {buttonContent}
    </button>
  );
};
