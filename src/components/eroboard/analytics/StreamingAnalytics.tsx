import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Video, 
  Clock, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  MessageCircle,
  Gift,
  Calendar,
  PlayCircle,
  Pause,
  BarChart3,
  Activity
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

interface StreamingAnalyticsProps {
  data: any;
  isLoading: boolean;
}

export const StreamingAnalytics = ({ data, isLoading }: StreamingAnalyticsProps) => {
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

  // Mock data
  const streamingStats = [
    {
      title: "Total Stream Hours",
      value: "234h 45m",
      change: "+18.2%",
      icon: Clock,
      color: "text-blue-400"
    },
    {
      title: "Avg. Viewers",
      value: "1,420",
      change: "+12.7%",
      icon: Users,
      color: "text-green-400"
    },
    {
      title: "Stream Revenue",
      value: "$8,950",
      change: "+25.1%",
      icon: DollarSign,
      color: "text-luxury-primary"
    },
    {
      title: "Peak Viewers",
      value: "3,250",
      change: "+8.3%",
      icon: TrendingUp,
      color: "text-pink-400"
    }
  ];

  const recentStreams = [
    {
      id: 1,
      title: "Saturday Night Chill 🌙",
      date: "2024-01-20",
      duration: "3h 45m",
      viewers: 2850,
      peakViewers: 3200,
      revenue: 1250,
      chatMessages: 8950,
      status: "completed"
    },
    {
      id: 2,
      title: "Friday Fun Stream",
      date: "2024-01-19",
      duration: "2h 30m",
      viewers: 1920,
      peakViewers: 2400,
      revenue: 820,
      chatMessages: 5650,
      status: "completed"
    },
    {
      id: 3,
      title: "Midweek Vibes",
      date: "2024-01-17",
      duration: "4h 15m",
      viewers: 3120,
      peakViewers: 3800,
      revenue: 1850,
      chatMessages: 12400,
      status: "completed"
    }
  ];

  const viewerRetention = [
    { minute: 0, retention: 100, viewers: 2850 },
    { minute: 15, retention: 85, viewers: 2422 },
    { minute: 30, retention: 75, viewers: 2137 },
    { minute: 45, retention: 68, viewers: 1938 },
    { minute: 60, retention: 62, viewers: 1767 },
    { minute: 90, retention: 55, viewers: 1567 },
    { minute: 120, retention: 48, viewers: 1368 },
    { minute: 150, retention: 42, viewers: 1197 },
    { minute: 180, retention: 38, viewers: 1083 }
  ];

  const hourlyPerformance = [
    { hour: "6 PM", viewers: 450, revenue: 125, engagement: 65 },
    { hour: "7 PM", viewers: 850, revenue: 280, engagement: 78 },
    { hour: "8 PM", viewers: 1450, revenue: 520, engagement: 92 },
    { hour: "9 PM", viewers: 2200, revenue: 780, engagement: 95 },
    { hour: "10 PM", viewers: 2850, revenue: 1250, engagement: 100 },
    { hour: "11 PM", viewers: 2400, revenue: 1080, engagement: 88 },
    { hour: "12 AM", viewers: 1800, revenue: 650, engagement: 72 }
  ];

  const topDonors = [
    { username: "BigTipper_VIP", amount: 450, tips: 8, avgTip: 56.25, avatar: "💎" },
    { username: "GenerousViewer", amount: 320, tips: 12, avgTip: 26.67, avatar: "👑" },
    { username: "SupporterFan", amount: 285, tips: 6, avgTip: 47.50, avatar: "🌟" },
    { username: "StreamLover", amount: 250, tips: 15, avgTip: 16.67, avatar: "❤️" },
    { username: "LoyalDonor", amount: 180, tips: 9, avgTip: 20.00, avatar: "⭐" }
  ];

  const bestStreamingTimes = [
    { day: "Monday", bestHour: "9 PM", avgViewers: 1250, avgRevenue: 420 },
    { day: "Tuesday", bestHour: "8 PM", avgViewers: 980, avgRevenue: 340 },
    { day: "Wednesday", bestHour: "10 PM", avgViewers: 1450, avgRevenue: 520 },
    { day: "Thursday", bestHour: "9 PM", avgViewers: 1680, avgRevenue: 580 },
    { day: "Friday", bestHour: "10 PM", avgViewers: 2200, avgRevenue: 850 },
    { day: "Saturday", bestHour: "10 PM", avgViewers: 2850, avgRevenue: 1250 },
    { day: "Sunday", bestHour: "9 PM", avgViewers: 1950, avgRevenue: 720 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Streaming Analytics 🎥
          </h1>
          <p className="text-gray-400">Monitor your live streaming performance</p>
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
          <Button className="bg-luxury-primary hover:bg-luxury-primary/90">
            <PlayCircle className="h-4 w-4 mr-2" />
            Go Live
          </Button>
        </div>
      </div>

      {/* Streaming Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {streamingStats.map((stat, index) => {
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

      {/* Viewer Retention Chart */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-luxury-primary" />
            Viewer Retention (Last Stream)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewerRetention}>
              <defs>
                <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="minute" 
                stroke="#9CA3AF"
                tickFormatter={(value) => `${value}m`}
              />
              <YAxis 
                yAxisId="left"
                stroke="#9CA3AF"
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#9CA3AF"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: any, name: string) => [
                  name === 'retention' ? `${value}%` : value,
                  name === 'retention' ? 'Retention' : 'Viewers'
                ]}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="retention" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#colorRetention)" 
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="viewers" 
                stroke="#EC4899" 
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Streaming Times */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-luxury-primary" />
              Best Streaming Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bestStreamingTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="avgViewers" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Donors */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="h-5 w-5 text-luxury-primary" />
              Top Stream Donors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topDonors.map((donor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-luxury-dark/50 rounded-lg hover:bg-luxury-dark transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-luxury-primary to-purple-600 rounded-full flex items-center justify-center text-xl">
                      {donor.avatar}
                    </div>
                    <Badge className="absolute -top-1 -right-1 bg-luxury-primary text-xs p-1">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-white">{donor.username}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{donor.tips} tips</span>
                      <span>Avg: ${donor.avgTip}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-luxury-primary">
                    ${donor.amount}
                  </p>
                  <p className="text-sm text-gray-400">Total donated</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Streams */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Video className="h-5 w-5 text-luxury-primary" />
            Recent Streams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentStreams.map((stream) => (
              <div key={stream.id} className="flex items-center justify-between p-4 bg-luxury-dark/50 rounded-lg hover:bg-luxury-dark transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-luxury-dark rounded-lg flex items-center justify-center">
                    <PlayCircle className="h-8 w-8 text-luxury-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">{stream.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(stream.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {stream.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {stream.viewers.toLocaleString()} avg
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-luxury-primary mb-1">
                    ${stream.revenue}
                  </p>
                  <div className="text-sm text-gray-400">
                    <p>Peak: {stream.peakViewers.toLocaleString()}</p>
                    <p>{stream.chatMessages.toLocaleString()} chats</p>
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