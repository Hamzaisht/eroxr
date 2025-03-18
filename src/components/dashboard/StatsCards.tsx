
import { DollarSign, Users, TrendingUp, Eye, Clock, FileText, Star, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    newSubscribers: number;
    returningSubscribers: number;
    vipFans: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statCards = [
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      trend: stats.earningsPercentile ? `Top ${Math.ceil(100 - (stats.earningsPercentile || 0))}%` : "+12.5%",
      color: "bg-green-500/10 text-green-500",
      tooltip: "Your total earnings after platform fees"
    },
    {
      title: "Subscribers",
      value: stats.totalSubscribers.toString(),
      icon: Users,
      trend: `+${stats.newSubscribers} new`,
      color: "bg-blue-500/10 text-blue-500",
      tooltip: "Total active subscribers to your content"
    },
    {
      title: "VIP Fans",
      value: stats.vipFans.toString(),
      icon: Star,
      trend: `${Math.round((stats.vipFans / Math.max(stats.totalSubscribers, 1)) * 100)}%`,
      color: "bg-purple-500/10 text-purple-500",
      tooltip: "Subscribers who purchase frequently"
    },
    {
      title: "Returning Subs",
      value: stats.returningSubscribers.toString(),
      icon: RefreshCw,
      trend: "Renewals",
      color: "bg-amber-500/10 text-amber-500",
      tooltip: "Subscribers who renewed their subscription"
    },
    {
      title: "Followers",
      value: stats.followers.toString(),
      icon: Users,
      trend: "",
      color: "bg-indigo-500/10 text-indigo-500",
      tooltip: "People following your profile"
    },
    {
      title: "Engagement Rate",
      value: `${stats.engagementRate}%`,
      icon: TrendingUp,
      trend: "+8.1%",
      color: "bg-pink-500/10 text-pink-500",
      tooltip: "Percentage of viewers who interact with your content"
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      trend: "+15.3%",
      color: "bg-cyan-500/10 text-cyan-500",
      tooltip: "Total number of views across all your content"
    },
    {
      title: "Content",
      value: stats.totalContent.toString(),
      icon: FileText,
      trend: "",
      color: "bg-orange-500/10 text-orange-500",
      tooltip: "Total number of posts, photos, and videos"
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Tooltip key={stat.title}>
            <TooltipTrigger asChild>
              <motion.div
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
            </TooltipTrigger>
            <TooltipContent className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral p-2">
              <p>{stat.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
