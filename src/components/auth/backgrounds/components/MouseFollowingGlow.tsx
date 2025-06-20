
import { motion } from "framer-motion";

interface MouseFollowingGlowProps {
  mousePosition: { x: number; y: number };
}

export const MouseFollowingGlow = ({ mousePosition }: MouseFollowingGlowProps) => {
  return (
    <>
      {/* Divine Aura - Following the user's presence */}
      <motion.div
        className="absolute w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(248,113,113,0.12) 25%, rgba(167,139,250,0.10) 50%, rgba(6,182,212,0.08) 75%, transparent 100%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.08,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.08,
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 15, damping: 25 },
          y: { type: "spring", stiffness: 15, damping: 25 },
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Love's Touch - Smaller, more responsive glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(139,92,246,0.20) 40%, rgba(6,182,212,0.15) 70%, transparent 100%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.15,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.15,
          scale: [0.9, 1.3, 0.9],
          rotate: [0, 180, 360],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 25, damping: 30 },
          y: { type: "spring", stiffness: 25, damping: 30 },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      />

      {/* Heart's Pulse - Intimate close glow */}
      <motion.div
        className="absolute w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(248,113,113,0.4) 0%, rgba(220,38,38,0.3) 30%, rgba(239,68,68,0.2) 60%, transparent 100%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.25,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.25,
          scale: [0.8, 1.5, 0.8],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 35, damping: 35 },
          y: { type: "spring", stiffness: 35, damping: 35 },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </>
  );
};
