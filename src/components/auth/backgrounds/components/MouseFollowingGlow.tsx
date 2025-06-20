
import { motion } from "framer-motion";

interface MouseFollowingGlowProps {
  mousePosition: { x: number; y: number };
}

export const MouseFollowingGlow = ({ mousePosition }: MouseFollowingGlowProps) => {
  return (
    <>
      {/* Subtle mouse-following glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.02,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.02,
        }}
        transition={{ 
          x: { type: "spring", stiffness: 50, damping: 50 },
          y: { type: "spring", stiffness: 50, damping: 50 },
        }}
      />
    </>
  );
};
