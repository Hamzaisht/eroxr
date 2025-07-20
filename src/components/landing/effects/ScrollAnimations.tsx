import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}

export const ScrollReveal = ({ 
  children, 
  direction = "up", 
  delay = 0,
  className = ""
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.5 0.5"]
  });

  const getInitialTransform = () => {
    switch (direction) {
      case "up": return { y: 60, opacity: 0 };
      case "down": return { y: -60, opacity: 0 };
      case "left": return { x: -60, opacity: 0 };
      case "right": return { x: 60, opacity: 0 };
      case "scale": return { scale: 0.8, opacity: 0 };
      default: return { y: 60, opacity: 0 };
    }
  };

  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const x = useTransform(scrollYProgress, [0, 1], direction === "left" ? [-60, 0] : direction === "right" ? [60, 0] : [0, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], direction === "scale" ? [0.8, 1] : [1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        y: direction === "up" || direction === "down" ? y : 0,
        x: direction === "left" || direction === "right" ? x : 0,
        scale,
        opacity
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const Parallax = ({ 
  children, 
  speed = 0.5,
  className = ""
}: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};