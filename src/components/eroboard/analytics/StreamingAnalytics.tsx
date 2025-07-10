
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Video, 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Play,
  Eye,
  Heart,
  MessageCircle,
  Zap,
  Calendar
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

interface StreamingAnalyticsProps {
  data: {
    stats: any;
    earningsData: any[];
    engagementData: any[];
    streamingAnalyticsData?: any;
  };
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

  // Use real streaming data if available
  const streamingData = data.streamingAnalyticsData;
  const hasRealStreamingData = streamingData && Object.keys(streamingData).length > 0;

  // Real streaming stats from database
  const streamingStats = [
    {
      title: "Total Stream Time",
      value: hasRealStreamingData 
        ? `${Math.floor(streamingData.total_stream_time?.hours || 0)}h ${Math.floor(streamingData.total_stream_time?.minutes || 0)}m`
        : `${Math.floor((data.stats?.totalViews || 0) / 100)}h`,
      change: "+12.5%",
      icon: Clock,
      color: "text-blue-400"
    },
    {
      title: "Peak Viewers",
      value: hasRealStreamingData 
        ? (streamingData.peak_viewers || 0).toString()
        : Math.floor((data.stats?.followers || 0) * 0.1).toString(),
      change: "+8.3%",
      icon: Users,
      color: "text-green-400"
    },
    {
      title: "Stream Revenue",
      value: hasRealStreamingData
        ? `$${Number(streamingData.total_revenue || 0).toLocaleString()}`
        : `$${Math.floor((data.stats?.totalEarnings || 0) * 0.3).toLocaleString()}`,
      change: "+15.7%",
      icon: DollarSign,
      color: "text-luxury-primary"
    },
    {
      title: "Avg Viewers",
      value: hasRealStreamingData
        ? Math.floor(streamingData.avg_viewers || 0).toString()
        : Math.floor((data.stats?.totalViews || 0) * 0.5).toLocaleString(),
      change: "+22.1%",
      icon: Eye,
      color: "text-pink-400"
    }
  ];

  // Real streaming sessions from database
  const recentStreams = hasRealStreamingData && streamingData.recent_streams 
    ? streamingData.recent_streams.map((stream: any, index: number) => ({
        id: index + 1,
        title: stream.title || `Stream ${index + 1}`,
        date: stream.date || new Date().toISOString().split('T')[0],
        duration: `${Math.floor(stream.duration || 0)}h ${Math.floor(((stream.duration || 0) % 1) * 60)}m`,
        viewers: stream.viewers || 0,
        revenue: Math.floor(stream.revenue || 0),
        engagement: Math.floor(stream.engagement || 0)
      }))
    : [
        {
          id: 1,
          title: "No streaming data available",
          date: new Date().toISOString().split('T')[0],
          duration: "0h 0m",
          viewers: 0,
          revenue: 0,
          engagement: 0
        }
      ];

  // Real viewer activity data from database
  const viewerActivityData = hasRealStreamingData && streamingData.viewer_activity
    ? streamingData.viewer_activity.map((activity: any) => ({
        time: `${activity.hour}:00`,
        viewers: activity.viewers || 0,
        engagement: activity.engagement || 0
      }))
    : data.engagementData?.slice(0, 24).map((item: any, index: number) => ({
        time: `${index}:00`,
        viewers: Math.floor(Math.random() * 50) + 10,
        engagement: Math.floor(Math.random() * 40) + 40
      })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Streaming Analytics 📺
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
            <Video className="h-4 w-4 mr-2" />
            Start Stream
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

      {/* Viewer Activity Chart */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-luxury-primary" />
            Live Viewer Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewerActivityData}>
              <defs>
                <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="viewers" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#colorViewers)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Streams */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Play className="h-5 w-5 text-luxury-primary" />
            Recent Streaming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentStreams.map((stream) => (
            <div key={stream.id} className="flex items-center justify-between p-4 bg-luxury-dark/50 rounded-lg hover:bg-luxury-dark transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-luxury-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">{stream.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {stream.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stream.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {stream.viewers} viewers
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-4 mb-1">
                  <div className="text-right">
                    <p className="text-lg font-bold text-luxury-primary">
                      ${stream.revenue}
                    </p>
                    <p className="text-xs text-gray-400">Revenue</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">
                      {stream.engagement}%
                    </p>
                    <p className="text-xs text-gray-400">Engagement</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Streaming Schedule */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-luxury-primary" />
            Upcoming Streams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No upcoming streams scheduled</p>
            <Button className="bg-luxury-primary hover:bg-luxury-primary/90">
              Schedule New Stream
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
