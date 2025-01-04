import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "2M+", label: "Active Users" },
  { value: "$50M+", label: "Creator Earnings" },
  { value: "150+", label: "Countries" },
  { value: "10K+", label: "Top Creators" }
];

export const AnimatedStats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="py-20 bg-luxury-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center relative group"
            >
              <motion.div
                className="absolute inset-0 bg-luxury-primary/5 rounded-xl -z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-secondary bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-luxury-neutral/60 group-hover:text-luxury-neutral transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};