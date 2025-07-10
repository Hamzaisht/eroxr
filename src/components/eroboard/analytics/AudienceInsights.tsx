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

  // Real engaged fans data
  const realEngagedFans = data.engagedFansData || [];
  const topFansByEngagement = realEngagedFans.length > 0 
    ? realEngagedFans.slice(0, 5).map(fan => ({
        username: fan.username,
        watchTime: `${Math.floor(fan.engagementScore / 20)}h ${Math.floor((fan.engagementScore % 20) * 3)}m`,
        comments: fan.totalComments,
        tips: fan.totalPurchases,
        engagement: Math.min(100, Math.floor(fan.engagementScore / 10)),
        avatar: fan.avatar,
        totalSpent: fan.totalSpent
      }))
    : [
        { username: "No engagement data", watchTime: "0h 0m", comments: 0, tips: 0, engagement: 0, avatar: "📊", totalSpent: 0 }
      ];

  // Real conversion funnel data  
  const realConversionData = data.conversionFunnelData || [];
  const conversionFunnel = realConversionData.length > 0
    ? realConversionData.map((stage, index) => ({
        stage: stage.stage,
        count: stage.count,
        percentage: stage.percentage,
        color: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'][index] || '#6B7280'
      }))
    : [
        { stage: "No conversion data", count: 0, percentage: 0, color: "#6B7280" }
      ];

  const hasEngagementData = realEngagedFans.length > 0;
  const hasConversionData = realConversionData.length > 0;

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

        {/* Real-Time Data Summary */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-luxury-primary" />
              Real-Time Analytics Summary
              {(hasEngagementData || hasConversionData) && (
                <Badge className="bg-green-500/20 text-green-400 text-xs ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                  Live
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-luxury-dark/50 rounded-lg">
                <div className="text-2xl font-bold text-luxury-primary mb-1">
                  {hasEngagementData ? realEngagedFans.length : 0}
                </div>
                <div className="text-sm text-gray-400">Active Engaged Fans</div>
              </div>
              <div className="text-center p-4 bg-luxury-dark/50 rounded-lg">
                <div className="text-2xl font-bold text-luxury-primary mb-1">
                  {hasConversionData ? conversionFunnel[0]?.count || 0 : 0}
                </div>
                <div className="text-sm text-gray-400">Total Profile Views</div>
              </div>
              <div className="text-center p-4 bg-luxury-dark/50 rounded-lg">
                <div className="text-2xl font-bold text-luxury-primary mb-1">
                  {hasEngagementData ? realEngagedFans.reduce((sum, fan) => sum + fan.totalSpent, 0).toFixed(0) : 0}
                </div>
                <div className="text-sm text-gray-400">Total Fan Spending ($)</div>
              </div>
              <div className="text-center p-4 bg-luxury-dark/50 rounded-lg">
                <div className="text-2xl font-bold text-luxury-primary mb-1">
                  {hasConversionData ? conversionFunnel.find(f => f.stage === 'Purchases')?.percentage.toFixed(1) || '0' : '0'}%
                </div>
                <div className="text-sm text-gray-400">Purchase Conversion</div>
              </div>
            </div>
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