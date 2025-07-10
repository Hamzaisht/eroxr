import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Globe, 
  Clock, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  UserPlus,
  UserMinus,
  Eye,
  Star,
  Crown,
  Activity
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface AudienceInsightsProps {
  data: any;
  isLoading: boolean;
}

export const AudienceInsights = ({ data, isLoading }: AudienceInsightsProps) => {
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

  // Real data from stats
  const totalFollowers = data.stats?.followers || 0;
  const newSubscribers = data.stats?.newSubscribers || 0;
  const engagementRate = data.stats?.engagementRate || 0;
  const vipFans = data.stats?.vipFans || 0;
  
  // Use real geographic data from the hook
  const realGeoData = data.geographicData || [];
  const geoData = realGeoData.length > 0 
    ? realGeoData.slice(0, 6).map(item => ({
        country: item.country || 'Unknown',
        fans: item.fans || 0,
        sessions: item.sessions || 0,
        percentage: item.percentage || 0,
        latitude: item.latitude,
        longitude: item.longitude
      }))
    : [
        { country: "No data yet", fans: 0, sessions: 0, percentage: 0, latitude: null, longitude: null }
      ];

  const hasRealData = realGeoData.length > 0;
  const totalSessions = geoData.reduce((sum, item) => sum + item.sessions, 0);
  
  const audienceStats = [
    {
      title: "Total Fans",
      value: totalFollowers.toLocaleString(),
      change: `+${newSubscribers}`,
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "New This Month",
      value: newSubscribers.toString(),
      change: "+8.7%",
      icon: Activity,
      color: "text-green-400"
    },
    {
      title: "Engagement Rate",
      value: `${engagementRate.toFixed(1)}%`,
      change: "+3.1%",
      icon: Heart,
      color: "text-pink-400"
    },
    {
      title: "VIP Fans",
      value: vipFans.toString(),
      change: "+5.3%",
      icon: Crown,
      color: "text-luxury-primary"
    }
  ];

  const topFansByEngagement = [
    { username: "SuperFan_01", watchTime: "45h 32m", comments: 156, tips: 24, engagement: 95, avatar: "🌟" },
    { username: "LoyalViewer", watchTime: "38h 15m", comments: 134, tips: 18, engagement: 88, avatar: "👑" },
    { username: "VIP_Member", watchTime: "42h 08m", comments: 89, tips: 31, engagement: 87, avatar: "💎" },
    { username: "RegularFan", watchTime: "29h 45m", comments: 201, tips: 12, engagement: 82, avatar: "❤️" },
    { username: "NewSupporter", watchTime: "21h 30m", comments: 78, tips: 15, engagement: 78, avatar: "⭐" }
  ];

  const activityHeatmap = [
    { hour: "00", Mon: 20, Tue: 18, Wed: 22, Thu: 25, Fri: 30, Sat: 45, Sun: 35 },
    { hour: "06", Mon: 45, Tue: 42, Wed: 48, Thu: 50, Fri: 55, Sat: 40, Sun: 38 },
    { hour: "12", Mon: 78, Tue: 82, Wed: 75, Thu: 80, Fri: 85, Sat: 90, Sun: 88 },
    { hour: "18", Mon: 95, Tue: 92, Wed: 98, Thu: 100, Fri: 105, Sat: 120, Sun: 110 },
    { hour: "21", Mon: 120, Tue: 115, Wed: 125, Thu: 130, Fri: 140, Sat: 160, Sun: 145 }
  ];

  const fanBehaviorRadar = [
    { metric: "Content Views", A: 120, B: 110, fullMark: 150 },
    { metric: "Comments", A: 98, B: 130, fullMark: 150 },
    { metric: "Tips Given", A: 86, B: 90, fullMark: 150 },
    { metric: "Share Rate", A: 99, B: 85, fullMark: 150 },
    { metric: "Session Time", A: 85, B: 65, fullMark: 150 },
    { metric: "Return Rate", A: 65, B: 85, fullMark: 150 }
  ];

  const conversionFunnel = [
    { stage: "Profile Views", count: 12450, percentage: 100, color: "#8B5CF6" },
    { stage: "Content Views", count: 8920, percentage: 71.7, color: "#EC4899" },
    { stage: "Interactions", count: 4560, percentage: 36.6, color: "#10B981" },
    { stage: "Subscriptions", count: 1840, percentage: 14.8, color: "#F59E0B" },
    { stage: "Purchases", count: 720, percentage: 5.8, color: "#EF4444" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Audience Insights 👥
          </h1>
          <p className="text-gray-400">Understand your fans and their behavior</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40 bg-luxury-dark border-luxury-neutral/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audience Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {audienceStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-to-br from-luxury-darker to-luxury-dark border-luxury-neutral/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <Badge className="bg-green-500/20 text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
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
              Real-Time Geographic Distribution
              {hasRealData && (
                <Badge className="bg-green-500/20 text-green-400 text-xs ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                  Live
                </Badge>
              )}
            </CardTitle>
            <p className="text-xs text-gray-400">
              {hasRealData 
                ? `${totalSessions} total sessions tracked`
                : "Waiting for visitor data..."
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geoData.map((country, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{country.country}</span>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {hasRealData ? (
                          <>
                            <span className="text-sm text-gray-400">{country.sessions} sessions</span>
                            <br />
                            <span>{country.fans} users</span>
                          </>
                        ) : (
                          "0 sessions"
                        )}
                      </p>
                      <p className="text-sm text-gray-400">{country.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-luxury-dark rounded-full h-2">
                      <div 
                        className="bg-luxury-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(country.percentage, 2)}%` }}
                      />
                    </div>
                    {hasRealData && country.latitude && country.longitude && (
                      <Badge className="text-xs bg-blue-500/20 text-blue-400">
                        📍 {country.latitude.toFixed(2)}, {country.longitude.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fan Behavior Radar */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-luxury-primary" />
              Fan Behavior Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={fanBehaviorRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <Radar 
                  name="Current Period" 
                  dataKey="A" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar 
                  name="Previous Period" 
                  dataKey="B" 
                  stroke="#EC4899" 
                  fill="#EC4899" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
            {conversionFunnel.map((stage, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{stage.stage}</span>
                  <div className="text-right">
                    <p className="text-white font-bold">{stage.count.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">{stage.percentage}%</p>
                  </div>
                </div>
                <div className="relative h-8 bg-luxury-dark rounded-lg overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${stage.percentage}%`,
                      backgroundColor: stage.color,
                      opacity: 0.8
                    }}
                  />
                  <div className="absolute inset-0 flex items-center px-4">
                    <span className="text-white text-sm font-medium">
                      {stage.stage}
                    </span>
                  </div>
                </div>
                {index < conversionFunnel.length - 1 && (
                  <div className="absolute right-0 top-full mt-1">
                    <Badge className="bg-red-500/20 text-red-400 text-xs">
                      -{(conversionFunnel[index].percentage - conversionFunnel[index + 1].percentage).toFixed(1)}%
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Engaging Fans */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-luxury-primary" />
            Most Engaged Fans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFansByEngagement.map((fan, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-luxury-dark/50 rounded-lg hover:bg-luxury-dark transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-luxury-primary to-purple-600 rounded-full flex items-center justify-center text-xl">
                      {fan.avatar}
                    </div>
                    <Badge className="absolute -top-1 -right-1 bg-luxury-primary text-xs p-1">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-white">{fan.username}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {fan.watchTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {fan.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {fan.tips} tips
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-16 bg-luxury-dark rounded-full h-2">
                      <div 
                        className="bg-luxury-primary h-2 rounded-full"
                        style={{ width: `${fan.engagement}%` }}
                      />
                    </div>
                    <span className="text-luxury-primary font-bold text-sm">
                      {fan.engagement}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Engagement Score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};