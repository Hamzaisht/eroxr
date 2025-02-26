
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Counter } from "./Counter";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  iconColor: string;
  delay: number;
  showTooltip?: boolean;
  tooltipContent?: string;
}

export const StatCard = ({ 
  icon: Icon,
  value,
  label,
  iconColor,
  delay,
  showTooltip = false,
  tooltipContent
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-darker/60 backdrop-blur-lg 
                 transition-colors duration-300 hover:bg-luxury-darker/80 cursor-pointer group"
    >
      <Icon className={`h-5 w-5 ${iconColor} animate-pulse`} />
      <div className="flex flex-col">
        <span className="text-white font-medium">
          <Counter value={value} />
        </span>
        <span className="text-xs text-white/60">{label}</span>
      </div>
      {showTooltip && tooltipContent && (
        <motion.div 
          className="absolute invisible group-hover:visible bg-luxury-darker/90 rounded-lg p-2 -top-12
                     border border-luxury-primary/20 backdrop-blur-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs text-white/80">{tooltipContent}</span>
        </motion.div>
      )}
    </motion.div>
  );
};
