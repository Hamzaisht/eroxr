
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useRef, useEffect, memo } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  text: string;
  delay?: number;
  duration?: number;
  gradient?: string;
  className?: string;
}

export const AnimatedGradientText = memo(({
  text,
  delay = 0,
  duration = 1,
  gradient = "from-luxury-primary to-luxury-accent",
  className
}: AnimatedGradientTextProps) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));
  
  // Character by character reveal animation
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, text.length, {
        type: "tween",
        delay,
        duration,
        ease: [0.3, 0.6, 0.2, 1],
      });
      
      return controls.stop;
    }
  }, [isInView, count, delay, duration, text]);
  
  return (
    <motion.h1 
      ref={textRef}
      className={cn(
        `bg-gradient-to-r ${gradient} bg-clip-text text-transparent relative`, 
        className
      )}
    >
      {text.split('').map((_, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ 
            duration: 0.5, 
            delay: delay + (i * 0.03),
            ease: [0.2, 0.65, 0.3, 0.9] 
          }}
        >
          {text[i]}
        </motion.span>
      ))}
    </motion.h1>
  );
});

AnimatedGradientText.displayName = "AnimatedGradientText";
