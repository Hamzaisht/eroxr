import { motion } from "framer-motion";
import { Crown, TrendingUp, Star, Users, DollarSign } from "lucide-react";

const topCreators = [
  {
    name: "Luna Rose",
    username: "luna_rose", 
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    earnings: "$24.8K",
    subscribers: "89.2K",
    growth: "+245%"
  },
  {
    name: "Alex Fitness",
    username: "alex_fit",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", 
    earnings: "$18.6K",
    subscribers: "67.1K",
    growth: "+189%"
  },
  {
    name: "Sophia Art",
    username: "sophia_art",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    earnings: "$16.2K", 
    subscribers: "54.7K",
    growth: "+156%"
  }
];

const platformStats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Creators",
    description: "Growing daily",
    color: "text-blue-400"
  },
  {
    icon: DollarSign,
    value: "$4.2M+",
    label: "Monthly Payouts",
    description: "To creators",
    color: "text-green-400"
  },
  {
    icon: TrendingUp,
    value: "312%",
    label: "Avg. Growth",
    description: "First 6 months",
    color: "text-purple-400"
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Creator Rating",
    description: "Based on 12K reviews",
    color: "text-yellow-400"
  }
];

export const SocialProofSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-purple-950/10 to-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Trusted by Top Creators
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            See how our top creators are earning more than ever before
          </motion.p>
        </motion.div>

        {/* Platform Stats */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {platformStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`} />
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-white font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Top Creators Spotlight */}
        <motion.div 
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">
              This Month's Top Earners
            </h3>
            <p className="text-gray-400">
              See how our featured creators are crushing their goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCreators.map((creator, index) => (
              <motion.div
                key={creator.username}
                className="bg-black/30 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-500"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-16 h-16 rounded-full border-2 border-purple-500"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-xs">#{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{creator.name}</h4>
                    <p className="text-gray-400 text-sm">@{creator.username}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Monthly Earnings</span>
                    <span className="text-green-400 font-bold text-lg">{creator.earnings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Subscribers</span>
                    <span className="text-blue-400 font-bold">{creator.subscribers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Growth</span>
                    <span className="text-purple-400 font-bold">{creator.growth}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            { label: "Bank-grade Security", value: "256-bit SSL" },
            { label: "Instant Payments", value: "24/7 Payouts" },
            { label: "Global Support", value: "12 Languages" },
            { label: "Content Protection", value: "AI-Powered" }
          ].map((badge, index) => (
            <motion.div
              key={badge.label}
              className="text-center p-4 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-purple-400 font-bold text-sm mb-1">
                {badge.value}
              </div>
              <div className="text-gray-400 text-xs">
                {badge.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};