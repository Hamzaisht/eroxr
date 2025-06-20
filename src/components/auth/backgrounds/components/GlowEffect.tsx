
import { motion } from "framer-motion";

interface GlowEffectProps {
  isPressed: boolean;
}

export const GlowEffect = ({ isPressed }: GlowEffectProps) => {
  if (!isPressed) return null;

  return (
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
      style={{
        background: "radial-gradient(circle, rgba(75, 222, 128, 0.1) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)",
        filter: "blur(30px)",
      }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0.9, 1.8, 0.9],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};
