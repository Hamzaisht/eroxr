import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Interactive background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#D946EF]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[#8B5CF6]/10 rounded-full blur-3xl"
        />
      </div>
      
      {/* Animated particles with enhanced glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2, scale: 0 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 2, 1],
              x: [0, Math.random() * 400 - 200, 0],
              y: [0, Math.random() * 400 - 200, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] rounded-full shadow-[0_0_10px_rgba(217,70,239,0.5)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
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

      {/* Interactive Trust Menu */}
      <div className="fixed top-8 right-8 flex flex-col gap-4 z-20">
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setActiveInfo("encryption")}
          className="group relative flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 cursor-pointer hover:bg-black/30 transition-all duration-300"
        >
          <span className="w-2 h-2 bg-[#D946EF] rounded-full animate-pulse shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
          <span className="text-white/80">Security</span>
          
          {activeInfo === "encryption" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-full mr-4 w-64 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10"
            >
              <h4 className="text-white font-medium mb-2">256-bit Encryption</h4>
              <p className="text-sm text-white/70">
                Your data is protected with military-grade encryption, ensuring maximum security for your content and personal information.
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setActiveInfo("gdpr")}
          className="group relative flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 cursor-pointer hover:bg-black/30 transition-all duration-300"
        >
          <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
          <span className="text-white/80">Privacy</span>
          
          {activeInfo === "gdpr" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-full mr-4 w-64 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10"
            >
              <h4 className="text-white font-medium mb-2">GDPR Compliant</h4>
              <p className="text-sm text-white/70">
                We follow strict European data protection regulations to ensure your privacy and data rights are respected at all times.
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setActiveInfo("support")}
          className="group relative flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 cursor-pointer hover:bg-black/30 transition-all duration-300"
        >
          <span className="w-2 h-2 bg-[#ec4899] rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
          <span className="text-white/80">Support</span>
          
          {activeInfo === "support" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-full mr-4 w-64 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10"
            >
              <h4 className="text-white font-medium mb-2">24/7 Support</h4>
              <p className="text-sm text-white/70">
                Our dedicated support team is available around the clock to assist you with any questions or concerns.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
