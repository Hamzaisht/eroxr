
import { motion } from "framer-motion";

interface MouseFollowingGlowProps {
  mousePosition: { x: number; y: number };
}

export const MouseFollowingGlow = ({ mousePosition }: MouseFollowingGlowProps) => {
  return (
    <>
      {/* Primary divine glow - multi-colored representing unity */}
      <motion.div
        className="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, rgba(245,158,11,0.03) 25%, rgba(244,114,182,0.025) 50%, rgba(6,182,212,0.02) 75%, transparent 100%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.015,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.015,
        }}
        transition={{ 
          x: { type: "spring", stiffness: 30, damping: 40 },
          y: { type: "spring", stiffness: 30, damping: 40 },
        }}
      />
      
      {/* Secondary wealth aura */}
      <motion.div
        className="absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(168,85,247,0.03) 60%, transparent 100%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.025,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.025,
        }}
        transition={{ 
          x: { type: "spring", stiffness: 40, damping: 30 },
          y: { type: "spring", stiffness: 40, damping: 30 },
        }}
      />
    </>
  );
};
