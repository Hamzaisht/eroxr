import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Globe, 
  Zap,
  Crown,
  Star,
  Heart
} from "lucide-react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
  increment: number;
}

const initialStats: Stat[] = [
  {
    label: "Active Creators",
    value: 47892,
    suffix: "",
    icon: <Users className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    increment: 3
  },
  {
    label: "Total Earnings Paid",
    value: 12847392,
    suffix: "kr",
    icon: <DollarSign className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    increment: 127
  },
  {
    label: "Content Pieces",
    value: 892456,
    suffix: "",
    icon: <Globe className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    increment: 15
  },
  {
    label: "Monthly Growth",
    value: 234,
    suffix: "%",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
    increment: 0.5
  }
];

const CountingNumber = ({ 
  value, 
  suffix, 
  duration = 2 
}: { 
  value: number; 
  suffix: string; 
  duration?: number; 
}) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    if (value > 1000000) {
      return `${(latest / 1000000).toFixed(1)}M`;
    } else if (value > 1000) {
      return `${(latest / 1000).toFixed(1)}K`;
    }
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    const controls = animate(motionValue, value, { duration });
    return controls.stop;
  }, [motionValue, value, duration]);

  return (
    <motion.span className="tabular-nums">
      <motion.span>{rounded}</motion.span>{suffix}
    </motion.span>
  );
};

const RecentActivity = () => {
  const activities = [
    { name: "Emma Rose", action: "earned $127 from livestream", time: "2m ago", color: "text-green-400" },
    { name: "Viktor Nord", action: "gained 234 new subscribers", time: "5m ago", color: "text-blue-400" },
    { name: "Luna Belle", action: "uploaded exclusive content", time: "8m ago", color: "text-purple-400" },
    { name: "Alex Frost", action: "received $89 in tips", time: "12m ago", color: "text-yellow-400" },
    { name: "Sofia Moon", action: "started live session", time: "15m ago", color: "text-pink-400" }
  ];

  const [currentActivity, setCurrentActivity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        <h3 className="text-lg font-bold text-white">Live Activity</h3>
      </div>
      
      <div className="space-y-3 h-40 overflow-hidden">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
              index === currentActivity 
                ? 'bg-luxury-primary/20 border border-luxury-primary/30' 
                : 'bg-slate-700/30'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: index === currentActivity ? 1 : 0.6,
              x: 0,
              scale: index === currentActivity ? 1.02 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-luxury-primary to-luxury-accent rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {activity.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                <span className="font-medium">{activity.name}</span> {activity.action}
              </p>
              <p className="text-xs text-slate-400">{activity.time}</p>
            </div>
            
            {index === currentActivity && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-luxury-primary"
              >
                <Zap className="w-4 h-4" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TopCreators = () => {
  const creators = [
    { name: "Emma Rose", earnings: "$15.2K", trend: "+12%", avatar: "ER" },
    { name: "Viktor Nord", earnings: "$13.8K", trend: "+8%", avatar: "VN" },
    { name: "Luna Belle", earnings: "$12.5K", trend: "+15%", avatar: "LB" },
  ];

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-white">Top Earners</h3>
      </div>
      
      <div className="space-y-3">
        {creators.map((creator, index) => (
          <motion.div
            key={creator.name}
            className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-luxury-primary to-luxury-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{creator.avatar}</span>
              </div>
              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Crown className="w-2 h-2 text-yellow-900" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-white font-medium">{creator.name}</p>
              <p className="text-sm text-slate-400">This month</p>
            </div>
            
            <div className="text-right">
              <p className="text-green-400 font-bold">{creator.earnings}</p>
              <p className="text-xs text-green-400">{creator.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const LiveStatsSection = () => {
  const [stats, setStats] = useState(initialStats);

  // Update stats in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: stat.value + Math.floor(Math.random() * stat.increment)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-luxury-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              LIVE PLATFORM STATS
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Real-Time Impact
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Watch our community grow in real-time. Every number represents creators building their dreams and fans finding their passions.
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-4`}>
                {stat.icon}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl md:text-4xl font-bold text-white">
                  <CountingNumber value={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-slate-400 font-medium">{stat.label}</p>
              </div>

              {/* Animated increment indicator */}
              <motion.div
                className="absolute top-4 right-4 text-green-400 text-sm font-bold opacity-0 group-hover:opacity-100"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                +{stat.increment}
              </motion.div>

              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
            </motion.div>
          ))}
        </div>

        {/* Secondary Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <RecentActivity />
          <TopCreators />
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Nordic Privacy Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span>Creator-First Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span>Instant Payouts</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};