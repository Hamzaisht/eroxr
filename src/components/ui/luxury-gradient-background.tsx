import { motion } from 'framer-motion';

interface LuxuryGradientBackgroundProps {
  className?: string;
}

export const LuxuryGradientBackground = ({ className = "" }: LuxuryGradientBackgroundProps) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
      
      {/* Floating gradient orbs */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0"
      />
      
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 80% 10%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 90%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 60%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0"
      />
      
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 60% 30%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 70%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0"
      />
      
      {/* Luxury mesh pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #8b5cf6 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};