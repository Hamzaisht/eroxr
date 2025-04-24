
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface GlowingButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  className?: string;
  glowColor?: string;
}

export const GlowingButton = React.forwardRef<HTMLButtonElement, GlowingButtonProps>(
  ({ asChild = false, className, glowColor = "rgba(155, 135, 245, 0.7)", children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const Comp = asChild ? Slot : "button";
    
    return (
      <motion.div
        className="relative"
        animate={isHovered ? { scale: 1.03 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* The glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-full blur-2xl"
          animate={
            isHovered 
              ? { 
                  opacity: 0.7,
                  scale: 1.1,
                  background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)` 
                }
              : { 
                  opacity: 0.4,
                  scale: 1,
                  background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 60%)` 
                }
          }
          transition={{ duration: 0.4 }}
        />
        
        {/* The button itself */}
        <Button
          ref={ref}
          asChild 
          size="lg"
          className={cn(
            "text-lg h-14 px-8 relative z-10 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary transition-all duration-500",
            className
          )}
          {...props}
        >
          <Comp>{children}</Comp>
        </Button>
      </motion.div>
    );
  }
);

GlowingButton.displayName = "GlowingButton";
