
import { motion } from "framer-motion";

interface StatCardProps {
  number: string;
  label: string;
  description: string;
}

export const StatCard = ({ number, label, description }: StatCardProps) => {
  return (
    <motion.div
      className="glass-effect p-8 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.h3 
        className="text-5xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300"
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {number}
      </motion.h3>
      <h4 className="text-2xl font-semibold text-white mb-2">{label}</h4>
      <p className="text-luxury-neutral text-lg">{description}</p>
    </motion.div>
  );
};
