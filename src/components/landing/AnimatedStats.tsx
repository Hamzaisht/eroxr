import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { StatCard } from "./sections/StatCard";

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
    <section ref={ref} className="relative overflow-hidden bg-luxury-dark py-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="container relative"
      >
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};