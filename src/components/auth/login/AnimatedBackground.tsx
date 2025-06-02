
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Dynamic background glow following mouse */}
      <motion.div
        className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-40"
        animate={{
          x: (mousePosition.x - window.innerWidth / 2) * 0.02,
          y: (mousePosition.y - window.innerHeight / 2) * 0.02,
          rotate: [0, 1, -1, 0],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "conic-gradient(from 0deg at 50% 50%, #06b6d4, #8b5cf6, #ec4899, #06b6d4)",
          padding: "2px",
          borderRadius: "1rem",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl" />
      </motion.div>
    </>
  );
};
