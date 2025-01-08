import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  index: number;
}

export const StatCard = ({ value, label, index }: StatCardProps) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-primary/10 to-luxury-accent/5 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl" />
      <div className="relative space-y-2 rounded-xl border border-luxury-primary/10 bg-luxury-dark/50 p-6 text-center backdrop-blur-xl">
        <div className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
          {value}
        </div>
        <div className="text-sm text-luxury-neutral/60 transition-colors group-hover:text-luxury-neutral">
          {label}
        </div>
      </div>
    </motion.div>
  );
};