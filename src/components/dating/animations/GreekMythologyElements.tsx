import { motion } from "framer-motion";
import { Crown, Zap, Star, Shield, Heart } from "lucide-react";

export const GreekSymbolsBackground = () => {
  const symbols = ['⚡', '🏛️', '🌟', '⚔️', '🏺', '🦅', '🌙', '☀️'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {symbols.map((symbol, i) => (
        <motion.div
          key={i}
          className="absolute text-white/5 text-6xl font-bold select-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-50, 50, -50],
            x: [-20, 20, -20],
            rotate: [0, 360],
            opacity: [0.02, 0.08, 0.02],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  );
};

export const DivineAura = ({ children, intensity = 1 }: { children: React.ReactNode; intensity?: number }) => {
  return (
    <motion.div
      className="relative"
      animate={{
        filter: [
          `drop-shadow(0 0 ${5 * intensity}px rgba(0, 245, 255, 0.3))`,
          `drop-shadow(0 0 ${15 * intensity}px rgba(139, 92, 246, 0.5))`,
          `drop-shadow(0 0 ${5 * intensity}px rgba(0, 245, 255, 0.3))`,
        ]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export const LightningEffect = ({ trigger }: { trigger: boolean }) => {
  if (!trigger) return null;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 1, 0, 1, 0],
        background: [
          "radial-gradient(circle, rgba(0,245,255,0) 0%, rgba(0,245,255,0) 100%)",
          "radial-gradient(circle, rgba(0,245,255,0.3) 0%, rgba(0,245,255,0) 70%)",
          "radial-gradient(circle, rgba(0,245,255,0) 0%, rgba(0,245,255,0) 100%)",
          "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(139,92,246,0) 70%)",
          "radial-gradient(circle, rgba(0,245,255,0) 0%, rgba(0,245,255,0) 100%)",
        ]
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  );
};

export const GodModeActivation = ({ active }: { active: boolean }) => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-inherit"
      animate={{
        boxShadow: active 
          ? [
              "0 0 0px rgba(255, 215, 0, 0)",
              "0 0 30px rgba(255, 215, 0, 0.6)",
              "0 0 60px rgba(255, 215, 0, 0.4)",
              "0 0 30px rgba(255, 215, 0, 0.6)",
              "0 0 0px rgba(255, 215, 0, 0)"
            ]
          : "0 0 0px rgba(255, 215, 0, 0)"
      }}
      transition={{
        duration: 2,
        repeat: active ? Infinity : 0,
        ease: "easeInOut"
      }}
    />
  );
};