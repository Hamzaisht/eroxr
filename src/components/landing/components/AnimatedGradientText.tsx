
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  delay?: number;
  gradient?: string;
  is3D?: boolean;
}

export const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({
  text,
  className,
  delay = 0,
  gradient = "from-white via-luxury-primary to-luxury-accent",
  is3D = true,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return;
      
      // Calculate mouse position relative to the center of the element
      const rect = textRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mousePosition.current = {
        x: (e.clientX - centerX) / 25, // Divide to reduce the effect
        y: (e.clientY - centerY) / 25,
      };
      
      if (is3D && textRef.current) {
        textRef.current.style.transform = `rotateY(${mousePosition.current.x}deg) rotateX(${-mousePosition.current.y}deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [is3D]);

  const words = text.split(" ");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: 0.12,
        delayChildren: delay,
      },
    },
  };
  
  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      ref={textRef}
      className={cn(
        "inline-block perspective-1000 transform-gpu transition-transform duration-300",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        transformStyle: is3D ? "preserve-3d" : "flat",
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={cn(
            "inline-block mr-4 bg-gradient-to-br bg-clip-text text-transparent",
            gradient
          )}
          variants={wordVariants}
          style={{
            textShadow: is3D 
              ? "0 1px 0 rgba(255,255,255,0.4), 0 2px 0 rgba(255,255,255,0.3), 0 3px 0 rgba(255,255,255,0.2), 0 8px 10px rgba(0,0,0,0.3)" 
              : "none",
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
