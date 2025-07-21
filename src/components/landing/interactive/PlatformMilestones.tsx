import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TrendingUp, Users, DollarSign, Zap, Award, Globe } from "lucide-react";

interface Milestone {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  description: string;
  color: string;
  bgColor: string;
}

const milestones: Milestone[] = [
  {
    id: "creators",
    icon: Users,
    title: "Active Creators",
    value: "12,847",
    description: "Premium creators earning consistently",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "earnings",
    icon: DollarSign,
    title: "Total Earnings",
    value: "$2.4M",
    description: "Distributed to creators this month",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: "fans",
    icon: Globe,
    title: "Global Fans",
    value: "487K",
    description: "Active subscribers worldwide",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    id: "content",
    icon: Zap,
    title: "Content Pieces",
    value: "156K",
    description: "Premium content uploaded monthly",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "satisfaction",
    icon: Award,
    title: "Creator Satisfaction",
    value: "98.2%",
    description: "Rate our platform as excellent",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: "growth",
    icon: TrendingUp,
    title: "Monthly Growth",
    value: "+47%",
    description: "New creators joining monthly",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

export const PlatformMilestones = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Platform That's{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Thriving
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Join a rapidly growing ecosystem where creators and fans connect authentically
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gray-800/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <milestone.icon className={`w-6 h-6 text-purple-400`} />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    {milestone.title}
                  </h3>
                  
                  <div className={`text-3xl font-bold text-purple-400`}>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    >
                      {milestone.value}
                    </motion.span>
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    {milestone.description}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Updates Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gray-900/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">Live Platform Stats</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-purple-400">
                <motion.span
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  234
                </motion.span>
              </div>
              <div className="text-xs text-gray-400">Online Now</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-400">
                <motion.span
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    delay: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  $47K
                </motion.span>
              </div>
              <div className="text-xs text-gray-400">Earned Today</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-400">
                <motion.span
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    delay: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  89
                </motion.span>
              </div>
              <div className="text-xs text-gray-400">New Uploads</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-pink-400">
                <motion.span
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    delay: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  156
                </motion.span>
              </div>
              <div className="text-xs text-gray-400">Live Streams</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};