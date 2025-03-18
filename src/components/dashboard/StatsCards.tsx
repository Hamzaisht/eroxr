
import { DollarSign, Users, TrendingUp, Eye, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalEarnings: number;
    totalSubscribers: number;
    engagementRate: number;
    earningsPercentile?: number | null;
    totalViews: number;
    timeOnPlatform: number;
    followers: number;
    totalContent: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statCards = [
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      trend: stats.earningsPercentile ? `Top ${Math.ceil(100 - (stats.earningsPercentile || 0))}%` : "+12.5%",
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
      title: "Followers",
      value: stats.followers.toString(),
      icon: Users,
      trend: "",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Posts",
      value: stats.totalContent.toString(),
      icon: FileText,
      trend: "",
      color: "bg-amber-500/10 text-amber-500"
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
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      trend: "+15.3%",
      color: "bg-pink-500/10 text-pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-5 glass-card hover:bg-luxury-darker/60 transition-all duration-300 border-0">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              {stat.trend && (
                <span className={`text-xs ${stat.title === "Total Earnings" && stats.earningsPercentile ? "text-green-500" : "text-green-500"}`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-luxury-muted text-sm">{stat.title}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
