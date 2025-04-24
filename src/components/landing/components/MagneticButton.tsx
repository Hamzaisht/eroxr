
import React, { useRef, useState, useEffect } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSoundEffects } from "@/hooks/use-sound-effects";

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "whileHover" | "whileTap" | "animate" | "transition"> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  asChild?: boolean;
  Component?: React.ElementType;
}

export const MagneticButton = ({
  children,
  className,
  magneticStrength = 1,
  asChild = false,
  Component: CustomComponent,
  ...props
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { playLikeSound } = useSoundEffects();
  
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
      y: distanceY * magneticScale * magneticStrength,
    });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add click sound
    playLikeSound();
    
    // Reset position
    setPosition({ x: 0, y: 0 });
    
    // Call the original onClick handler if provided
    if (props.onClick) {
      props.onClick(e);
    }
  };

  const Component = asChild ? CustomComponent : "button";
  
  const motionProps: HTMLMotionProps<"button"> = {
    ref: buttonRef,
    className: cn("relative inline-block", className),
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    animate: {
      x: position.x,
      y: position.y,
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
    ...props
  };

  return (
    <motion.button {...motionProps}>
      {children}
    </motion.button>
  );
};
