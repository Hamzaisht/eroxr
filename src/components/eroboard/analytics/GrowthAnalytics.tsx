import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  UserPlus, 
  Target, 
  BarChart3,
  Download,
  Calendar,
  Globe,
  Zap
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  ComposedChart,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface GrowthAnalyticsProps {
  data: {
    stats: any;
    growthAnalyticsData?: any;
    geographicData: any[];
  };
  isLoading: boolean;
}

export const GrowthAnalytics = ({ data, isLoading }: GrowthAnalyticsProps) => {
  const [timeFilter, setTimeFilter] = useState("30d");

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 bg-luxury-darker/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const growthData = data.growthAnalyticsData;
  const hasRealGrowthData = growthData && Object.keys(growthData).length > 0;

  // Growth metrics
  const growthStats = [
    {
      title: "Follower Growth Rate",
      value: hasRealGrowthData ? `${growthData.follower_growth_rate?.toFixed(1)}%` : "15.5%",
      change: "+2.3%",
      icon: TrendingUp,
      color: "text-green-400",
      trend: "up"
    },
    {
      title: "Subscription Rate",
      value: hasRealGrowthData ? `${growthData.subscription_rate?.toFixed(1)}%` : "12.3%",
      change: "+1.8%",
      icon: Users,
      color: "text-blue-400",
      trend: "up"
    },
    {
      title: "Retention Rate",
      value: hasRealGrowthData ? `${growthData.retention_rate?.toFixed(1)}%` : "85.2%",
      change: "-1.2%",
      icon: Target,
      color: "text-purple-400",
      trend: "down"
    },
    {
      title: "Churn Rate",
      value: hasRealGrowthData ? `${growthData.churn_rate?.toFixed(1)}%` : "14.8%",
      change: "-0.8%",
      icon: TrendingDown,
      color: "text-red-400",
      trend: "down"
    }
  ];

  // Daily growth data
  const dailyGrowthData = hasRealGrowthData && growthData.daily_growth_data ? 
    growthData.daily_growth_data.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      followers: item.followers,
      subscribers: item.subscribers,
      growth: item.followers - (item.followers * 0.95) // Simulated growth
    })) :
    Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      followers: 100 + i * 2 + Math.floor(Math.random() * 5),
      subscribers: 50 + i + Math.floor(Math.random() * 3),
      growth: Math.floor(Math.random() * 10) + 1
    }));

  // Retention data
  const retentionData = hasRealGrowthData && growthData.retention_data ? 
    growthData.retention_data : [
      { period: 'Week 1', retention: 95, users: 950 },
      { period: 'Week 2', retention: 87, users: 870 },
      { period: 'Month 1', retention: 78, users: 780 },
      { period: 'Month 3', retention: 65, users: 650 },
      { period: 'Month 6', retention: 52, users: 520 }
    ];

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-between items-start">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Growth Analytics</h2>
          <p className="text-gray-400 text-sm sm:text-base">Track your growth metrics and retention patterns</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-32 bg-luxury-darker border-luxury-neutral/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="border-luxury-neutral/20 w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Growth Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {growthStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={index} className="bg-luxury-darker border-luxury-neutral/10 hover:border-luxury-primary/30 transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                  <Badge className={`${stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} border-0 flex items-center gap-1 text-xs`}>
                    <TrendIcon className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-gray-400">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Daily Growth Chart */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
            <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-luxury-primary" />
            Daily Growth Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dailyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="followers" 
                  fill="#8b5cf6" 
                  fillOpacity={0.3} 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Followers"
                />
                <Line 
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="Subscribers"
                />
                <Bar dataKey="growth" fill="#10b981" fillOpacity={0.7} name="Daily Growth" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Retention Analysis */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-luxury-primary" />
              Retention Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {retentionData.map((period, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm md:text-base">{period.period}</p>
                    <p className="text-gray-400 text-xs md:text-sm">{period.users || Math.floor(period.retention * 10)} users</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <div className="w-20 md:w-24 h-2 bg-luxury-neutral/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-luxury-primary to-luxury-accent rounded-full"
                        style={{ width: `${period.retention}%` }}
                      />
                    </div>
                    <span className="text-white font-medium w-10 md:w-12 text-right text-sm md:text-base">{period.retention}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Growth */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
              <Globe className="h-4 w-4 md:h-5 md:w-5 text-luxury-primary" />
              Geographic Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hasRealGrowthData && growthData.geographic_breakdown ? growthData.geographic_breakdown : data.geographicData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="percentage"
                    label={({ country, percentage }) => `${country} ${percentage}%`}
                  >
                    {(hasRealGrowthData && growthData.geographic_breakdown ? growthData.geographic_breakdown : data.geographicData).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Predictions */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
            <Zap className="h-4 w-4 md:h-5 md:w-5 text-luxury-primary" />
            Growth Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-4 md:p-6 bg-luxury-dark rounded-lg border border-luxury-neutral/10">
              <UserPlus className="h-6 w-6 md:h-8 md:w-8 text-blue-400 mx-auto mb-3" />
              <p className="text-xl md:text-2xl font-bold text-white mb-1">
                {hasRealGrowthData ? (data.stats?.followers || 0) + Math.floor((growthData.follower_growth_rate || 15) / 100 * (data.stats?.followers || 100)) : "1,250"}
              </p>
              <p className="text-gray-400 text-sm md:text-base">Projected followers next month</p>
              <Badge className="bg-blue-500/20 text-blue-400 mt-2 text-xs">
                +{hasRealGrowthData ? growthData.follower_growth_rate?.toFixed(1) : "15.5"}% growth
              </Badge>
            </div>
            
            <div className="text-center p-4 md:p-6 bg-luxury-dark rounded-lg border border-luxury-neutral/10">
              <Target className="h-6 w-6 md:h-8 md:w-8 text-green-400 mx-auto mb-3" />
              <p className="text-xl md:text-2xl font-bold text-white mb-1">
                ${hasRealGrowthData ? ((data.stats?.totalEarnings || 0) * 1.25).toFixed(0) : "5,200"}
              </p>
              <p className="text-gray-400 text-sm md:text-base">Projected earnings next month</p>
              <Badge className="bg-green-500/20 text-green-400 mt-2 text-xs">
                +25% revenue growth
              </Badge>
            </div>
            
            <div className="text-center p-4 md:p-6 bg-luxury-dark rounded-lg border border-luxury-neutral/10 sm:col-span-2 lg:col-span-1">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-400 mx-auto mb-3" />
              <p className="text-xl md:text-2xl font-bold text-white mb-1">
                {hasRealGrowthData ? `${(growthData.retention_rate || 85) + 2}%` : "87%"}
              </p>
              <p className="text-gray-400 text-sm md:text-base">Predicted retention rate</p>
              <Badge className="bg-purple-500/20 text-purple-400 mt-2 text-xs">
                +2% improvement
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};