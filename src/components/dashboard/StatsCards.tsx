
import { DollarSign, Users, TrendingUp, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  stats: {
    totalEarnings: number;
    totalSubscribers: number;
    engagementRate: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statCards = [
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      trend: "+12.5%",
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Subscribers",
      value: stats.totalSubscribers.toString(),
      icon: Users,
      trend: "+5.2%",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Engagement Rate",
      value: `${stats.engagementRate}%`,
      icon: TrendingUp,
      trend: "+8.1%",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Total Views",
      value: "12.5K",
      icon: Eye,
      trend: "+15.3%",
      color: "bg-pink-500/10 text-pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6 hover:scale-105 transition-transform duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <span className="text-sm text-green-500">{stat.trend}</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
          <p className="text-luxury-muted text-sm">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  );
}
