
import React, { useRef, useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  asChild?: boolean;
  Component?: React.ElementType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const MagneticButton = memo(({
  children,
  className,
  magneticStrength = 1,
  asChild = false,
  Component,
  onClick,
  ...props
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Scale the effect based on the button size
    const magneticScale = Math.min(width, height) / 100;
    
    setPosition({
      x: distanceX * magneticScale * magneticStrength,
      y: distanceY * magneticScale * magneticStrength
    });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Reset position
    setPosition({ x: 0, y: 0 });
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  // Use the Component specified, or just a button if not specified
  const ButtonComponent = asChild ? (Component || "button") : "button";
  
  return (
    <motion.button
      ref={buttonRef}
      className={cn("relative inline-block", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.97,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

MagneticButton.displayName = "MagneticButton";
