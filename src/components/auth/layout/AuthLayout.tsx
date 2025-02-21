
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Interactive background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#D946EF]/5 rounded-full blur-3xl"
          style={{
            filter: 'blur(120px)',
          }}
        />
        <motion.div
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[#8B5CF6]/5 rounded-full blur-3xl"
          style={{
            filter: 'blur(120px)',
          }}
        />
      </div>

      {/* Card container with clean design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {children}
      </motion.div>

      {/* Interactive Trust Menu */}
      <div className="fixed top-8 right-8 flex flex-col gap-4 z-20">
        <motion.div
          onHoverStart={() => setActiveInfo("encryption")}
          onHoverEnd={() => setActiveInfo(null)}
          whileHover={{ scale: 1.05 }}
          className="group relative flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 cursor-pointer hover:bg-black/30 transition-all duration-300"
        >
          <span className="w-2 h-2 bg-[#D946EF] rounded-full animate-pulse shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
          <span className="text-white/80">Security</span>
          
          <AnimatePresence>
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
          </AnimatePresence>
        </motion.div>

        <motion.div
          onHoverStart={() => setActiveInfo("gdpr")}
          onHoverEnd={() => setActiveInfo(null)}
          whileHover={{ scale: 1.05 }}
          className="group relative flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 cursor-pointer hover:bg-black/30 transition-all duration-300"
        >
          <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
          <span className="text-white/80">Privacy</span>
          
          <AnimatePresence>
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
          </AnimatePresence>
        </motion.div>

        <motion.div
          onHoverStart={() => setActiveInfo("support")}
          onHoverEnd={() => setActiveInfo(null)}
          whileHover={{ scale: 1.05 }}
          className="group relative flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 cursor-pointer hover:bg-black/30 transition-all duration-300"
        >
          <span className="w-2 h-2 bg-[#ec4899] rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
          <span className="text-white/80">Support</span>
          
          <AnimatePresence>
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
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
