import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Globe, 
  Heart, 
  TrendingUp, 
  UserPlus, 
  Crown,
  Download,
  MapPin,
  Star,
  Target
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart,
  ComposedChart
} from "recharts";

interface AudienceAnalyticsProps {
  data: {
    stats: any;
    geographicData: any[];
    engagedFansData: any[];
    conversionFunnelData: any[];
    growthAnalyticsData?: any;
  };
  isLoading: boolean;
}

export const AudienceAnalytics = ({ data, isLoading }: AudienceAnalyticsProps) => {
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

  // Audience metrics
  const audienceStats = [
    {
      title: "Total Followers",
      value: data.stats?.followers?.toLocaleString() || "0",
      change: hasRealGrowthData ? `+${growthData.follower_growth_rate?.toFixed(1)}%` : "+15.5%",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Engagement Rate",
      value: `${data.stats?.engagementRate?.toFixed(1) || "0"}%`,
      change: "+8.2%",
      icon: Heart,
      color: "text-pink-400"
    },
    {
      title: "Retention Rate",
      value: hasRealGrowthData ? `${growthData.retention_rate?.toFixed(1)}%` : "85.2%",
      change: "+5.1%",
      icon: Target,
      color: "text-green-400"
    },
    {
      title: "New Today",
      value: hasRealGrowthData ? growthData.new_followers_today : "8",
      change: "New followers",
      icon: UserPlus,
      color: "text-purple-400"
    }
  ];

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Audience Analytics</h2>
          <p className="text-gray-400">Understand your audience demographics and engagement patterns</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32 bg-luxury-darker border-luxury-neutral/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="border-luxury-neutral/20">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Audience Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {audienceStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-luxury-darker border-luxury-neutral/10 hover:border-luxury-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-luxury-primary" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.geographicData.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-luxury-primary" />
                    <div>
                      <p className="text-white font-medium">{location.city}, {location.country}</p>
                      <p className="text-gray-400 text-sm">{location.fans} fans • {location.sessions} sessions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{location.percentage}%</p>
                    <div className="w-20 h-2 bg-luxury-neutral/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-luxury-primary rounded-full"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-luxury-primary" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.conversionFunnelData.map((stage, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{stage.stage}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{stage.count.toLocaleString()}</span>
                      <Badge className="bg-luxury-primary/20 text-luxury-primary">
                        {stage.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-luxury-neutral/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-luxury-primary to-luxury-accent rounded-full transition-all duration-1000"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Analytics */}
      {hasRealGrowthData && growthData.daily_growth_data && (
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-luxury-primary" />
              Growth Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={growthData.daily_growth_data}>
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
                  <Area type="monotone" dataKey="followers" fill="#8b5cf6" fillOpacity={0.3} stroke="#8b5cf6" />
                  <Line type="monotone" dataKey="subscribers" stroke="#06b6d4" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Most Engaged Fans */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-luxury-primary" />
            Most Engaged Fans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.engagedFansData.map((fan, index) => (
              <div key={fan.userId} className="p-4 bg-luxury-dark rounded-lg border border-luxury-neutral/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-luxury-primary/20 rounded-full flex items-center justify-center text-xl">
                    {fan.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium">{fan.username}</p>
                    <p className="text-gray-400 text-sm">Rank #{fan.rank}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Spent:</span>
                    <span className="text-white font-medium">${fan.totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Purchases:</span>
                    <span className="text-white">{fan.totalPurchases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Engagement:</span>
                    <Badge className="bg-luxury-primary/20 text-luxury-primary text-xs">
                      {fan.engagementScore}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};