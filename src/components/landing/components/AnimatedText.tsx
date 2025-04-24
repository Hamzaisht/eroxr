
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  delay = 0,
  className = "" 
}) => {
  // Split text into individual characters
  const characters = text.split("");
  
  const characterAnimation = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: (i: number) => ({ 
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.05 + delay,
        duration: 0.5,
        ease: "easeOut" 
      }
    })
  };
  
  return (
    <span className={cn("inline-block", className)}>
      {characters.map((char, index) => (
        <motion.span
          key={`${index}-${char}`}
          className="inline-block"
          custom={index}
          initial="hidden"
          animate="visible"
          variants={characterAnimation}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};
