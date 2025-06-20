
import { motion } from "framer-motion";

interface MouseFollowingGlowProps {
  mousePosition: { x: number; y: number };
}

export const MouseFollowingGlow = ({ mousePosition }: MouseFollowingGlowProps) => {
  return (
    <motion.div
      className="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(139,92,246,0.3) 30%, rgba(6,182,212,0.2) 60%, transparent 100%)",
        filter: "blur(60px)",
      }}
      animate={{
        x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.1,
        y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.1,
        scale: [1, 1.2, 1],
      }}
      transition={{ 
        x: { type: "spring", stiffness: 20, damping: 30 },
        y: { type: "spring", stiffness: 20, damping: 30 },
        scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
      }}
    />
  );
};
