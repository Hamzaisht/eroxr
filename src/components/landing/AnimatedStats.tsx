
import { motion } from "framer-motion";
import { StatCard } from "./sections/StatCard";

export const AnimatedStats = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard
            number=""
            label="Active Creators"
            description="Join our growing community of content creators"
          />
          <StatCard
            number=""
            label="Monthly Users"
            description="Connect with engaged fans"
          />
          <StatCard
            number=""
            label="Creator Earnings"
            description="Our creators earn through diverse revenue streams"
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
