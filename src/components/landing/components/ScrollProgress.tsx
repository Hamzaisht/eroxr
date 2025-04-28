
import { motion, useScroll } from "framer-motion";

interface ScrollProgressProps {
  color?: string;
  height?: number;
  zIndex?: number;
}

export const ScrollProgress = ({
  color = "linear-gradient(to right, #9b87f5, #D946EF)",
  height = 3,
  zIndex = 50
}: ScrollProgressProps) => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 origin-left will-change-transform"
      style={{
        background: color,
        height: height,
        zIndex: zIndex,
        scaleX: scrollYProgress,
      }}
    />
  );
};
