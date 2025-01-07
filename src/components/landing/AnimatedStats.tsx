import { motion, useInView } from "framer-motion";
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
            <motion.div
              key={index}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-luxury-primary/10 to-luxury-accent/5 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl" />
              <div className="relative space-y-2 rounded-xl border border-luxury-primary/10 bg-luxury-dark/50 p-6 text-center backdrop-blur-xl">
                <div className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-luxury-neutral/60 transition-colors group-hover:text-luxury-neutral">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};