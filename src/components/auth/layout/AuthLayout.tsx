
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Interactive background elements - Liquid metal effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
            rotate: mousePosition.x * 0.02,
          }}
          transition={{ type: "spring", damping: 30 }}
          className="absolute -top-1/2 -left-1/2 w-[150%] h-[150%] bg-gradient-to-r from-[#D946EF]/20 to-[#8B5CF6]/20 rounded-[100%] blur-3xl"
          style={{
            filter: "blur(100px) saturate(150%)",
            mixBlendMode: "soft-light",
          }}
        />
        <motion.div
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
            rotate: mousePosition.x * -0.02,
          }}
          transition={{ type: "spring", damping: 30 }}
          className="absolute -bottom-1/2 -right-1/2 w-[150%] h-[150%] bg-gradient-to-r from-[#8B5CF6]/20 to-black/40 rounded-[100%] blur-3xl"
          style={{
            filter: "blur(100px) saturate(150%)",
            mixBlendMode: "color-dodge",
          }}
        />
      </div>

      {/* Card container with enhanced glass effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10">
          {children}
        </div>
      </motion.div>

      {/* Trust indicators with enhanced styling */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 text-sm">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5"
        >
          <span className="w-2 h-2 bg-[#D946EF] rounded-full animate-pulse shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
          <span className="text-white/80">256-bit Encryption</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5"
        >
          <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
          <span className="text-white/80">GDPR Compliant</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5"
        >
          <span className="w-2 h-2 bg-[#ec4899] rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
          <span className="text-white/80">24/7 Support</span>
        </motion.div>
      </div>
    </div>
  );
};
