
import React, { useRef, useState, useEffect, memo } from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSoundEffects } from "@/hooks/use-sound-effects";

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { playLikeSound } = useSoundEffects();
  
  // Transform mouse position to button position
  const positionX = useTransform(mouseX, (val) => {
    return val * magneticStrength;
  });
  
  const positionY = useTransform(mouseY, (val) => {
    return val * magneticStrength;
  });
  
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
    
    mouseX.set(distanceX * magneticScale);
    mouseY.set(distanceY * magneticScale);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add click sound
    playLikeSound();
    
    // Reset position
    mouseX.set(0);
    mouseY.set(0);
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  // Clean up animations on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      mouseX.destroy();
      mouseY.destroy();
    };
  }, []);

  // Use the Component specified, or just a button if not specified
  const ButtonComponent = asChild ? (Component || "button") : "button";
  
  // Separate motion props from other props to avoid type errors
  const motionProps = {
    ref: buttonRef,
    className: cn("relative inline-block", className),
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    animate: {
      x: positionX,
      y: positionY,
    },
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      mass: 0.1,
    },
    whileHover: {
      scale: 1.05,
    },
    whileTap: {
      scale: 0.97,
    },
  };

  return (
    <motion.button {...motionProps} {...props}>
      {children}
    </motion.button>
  );
});

MagneticButton.displayName = "MagneticButton";
