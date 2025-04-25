
import { motion } from "framer-motion";
import { memo } from "react";

export const GlowingStats = memo(() => {
  const stats = [
    { value: "12.5k+", label: "Creators" },
    { value: "1.2M+", label: "Subscribers" },
    { value: "$24M+", label: "Creator Earnings" }
  ];
  
  return (
    <motion.div 
      className="inline-flex flex-wrap gap-4 sm:gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="inline-flex items-center pr-4 sm:pr-6 border-r border-luxury-primary/20 last:border-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + (index * 0.1) }}
        >
          <div className="relative">
            <motion.span 
              className="text-white font-bold text-base sm:text-lg relative z-10"
              animate={{ 
                textShadow: [
                  "0 0 3px rgba(181, 99, 255, 0.3)",
                  "0 0 10px rgba(181, 99, 255, 0.5)",
                  "0 0 3px rgba(181, 99, 255, 0.3)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {stat.value}
            </motion.span>
            <div className="ml-2 text-xs sm:text-sm text-luxury-neutral/70">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

GlowingStats.displayName = "GlowingStats";

export default GlowingStats;
