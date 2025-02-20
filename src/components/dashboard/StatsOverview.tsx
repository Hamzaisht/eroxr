import { DollarSign, Users, Eye, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsProps {
  stats: {
    totalEarnings: number;
    totalSubscribers: number;
    totalViews: number;
    engagementRate: number;
    followers: number;
    revenueShare: number;
  };
}

export const StatsOverview = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-luxury-primary/10 rounded-full">
            <DollarSign className="h-6 w-6 text-luxury-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-luxury-neutral/70">Total Earnings</h3>
            <p className="text-2xl font-bold text-luxury-primary">
              ${stats.totalEarnings.toFixed(2)}
            </p>
            <span className="text-xs text-luxury-neutral/50">After 8% platform fee</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-luxury-primary/10 rounded-full">
            <Users className="h-6 w-6 text-luxury-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-luxury-neutral/70">Subscribers</h3>
            <p className="text-2xl font-bold text-luxury-primary">{stats.totalSubscribers}</p>
            <span className="text-xs text-luxury-neutral/50">{stats.followers} followers</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-luxury-primary/10 rounded-full">
            <Eye className="h-6 w-6 text-luxury-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-luxury-neutral/70">Total Views</h3>
            <p className="text-2xl font-bold text-luxury-primary">{stats.totalViews}</p>
            <span className="text-xs text-luxury-neutral/50">Across all content</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-luxury-primary/10 rounded-full">
            <TrendingUp className="h-6 w-6 text-luxury-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-luxury-neutral/70">Engagement Rate</h3>
            <p className="text-2xl font-bold text-luxury-primary">
              {stats.engagementRate}%
            </p>
            <span className="text-xs text-luxury-neutral/50">Based on interactions</span>
          </div>
        </div>
      </Card>
    </div>
  );
};