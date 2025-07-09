import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Image, 
  Eye, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share, 
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Play,
  Camera,
  Zap
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

interface ContentPerformanceProps {
  data: any;
  isLoading: boolean;
}

export const ContentPerformance = ({ data, isLoading }: ContentPerformanceProps) => {
  const [timeFilter, setTimeFilter] = useState("30d");
  const [contentType, setContentType] = useState("all");

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
  const contentStats = [
    {
      title: "Total Views",
      value: "2.4M",
      change: "+15.2%",
      icon: Eye,
      color: "text-blue-400"
    },
    {
      title: "Avg. Watch Time",
      value: "4:32",
      change: "+8.7%",
      icon: Clock,
      color: "text-green-400"
    },
    {
      title: "Engagement Rate",
      value: "12.8%",
      change: "+3.1%",
      icon: Heart,
      color: "text-pink-400"
    },
    {
      title: "Revenue per View",
      value: "$0.52",
      change: "+5.3%",
      icon: DollarSign,
      color: "text-luxury-primary"
    }
  ];

  const topPosts = [
    {
      id: 1,
      title: "Summer Vibes 🌞",
      type: "video",
      views: 125000,
      likes: 8950,
      comments: 456,
      saves: 1240,
      earnings: 2850,
      duration: "5:23",
      engagement: 8.2,
      thumbnail: "/placeholder-thumbnail.jpg"
    },
    {
      id: 2,
      title: "Behind the Scenes",
      type: "image",
      views: 98000,
      likes: 7200,
      comments: 320,
      saves: 890,
      earnings: 1950,
      duration: null,
      engagement: 9.1,
      thumbnail: "/placeholder-thumbnail.jpg"
    },
    {
      id: 3,
      title: "Live Stream Highlights",
      type: "video",
      views: 87000,
      likes: 6800,
      comments: 1250,
      saves: 650,
      earnings: 3200,
      duration: "12:45",
      engagement: 10.5,
      thumbnail: "/placeholder-thumbnail.jpg"
    }
  ];

  const viewsOverTime = [
    { date: "Mon", views: 45000, engagement: 8.2 },
    { date: "Tue", views: 52000, engagement: 9.1 },
    { date: "Wed", views: 48000, engagement: 7.8 },
    { date: "Thu", views: 61000, engagement: 10.2 },
    { date: "Fri", views: 75000, engagement: 12.5 },
    { date: "Sat", views: 89000, engagement: 14.1 },
    { date: "Sun", views: 67000, engagement: 11.3 }
  ];

  const contentTypeBreakdown = [
    { type: "Videos", count: 45, percentage: 55, earnings: 18500, avgViews: 52000 },
    { type: "Images", count: 32, percentage: 35, earnings: 12800, avgViews: 34000 },
    { type: "Stories", count: 18, percentage: 10, earnings: 3200, avgViews: 15000 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Content Performance 📊
          </h1>
          <p className="text-gray-400">Analyze your content's impact and reach</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-40 bg-luxury-dark border-luxury-neutral/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="images">Images</SelectItem>
              <SelectItem value="stories">Stories</SelectItem>
              <SelectItem value="live">Live Streams</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentStats.map((stat, index) => {
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

      {/* Views and Engagement Chart */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart className="h-5 w-5 text-luxury-primary" />
            Views & Engagement Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsOverTime}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="views" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="engagement" 
                stroke="#EC4899" 
                strokeWidth={3}
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Content */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-luxury-primary" />
              Top Performing Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center gap-4 p-4 bg-luxury-dark/50 rounded-lg hover:bg-luxury-dark transition-colors">
                <div className="relative">
                  <div className="w-16 h-16 bg-luxury-dark rounded-lg flex items-center justify-center">
                    {post.type === 'video' ? (
                      <Video className="h-6 w-6 text-luxury-primary" />
                    ) : (
                      <Image className="h-6 w-6 text-luxury-primary" />
                    )}
                  </div>
                  <Badge className="absolute -top-2 -left-2 bg-luxury-primary text-xs">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{post.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${post.earnings}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-luxury-primary">
                    {post.engagement}%
                  </p>
                  <p className="text-xs text-gray-400">Engagement</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Content Type Breakdown */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart className="h-5 w-5 text-luxury-primary" />
              Content Type Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentTypeBreakdown.map((type, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {type.type === 'Videos' && <Video className="h-4 w-4 text-luxury-primary" />}
                    {type.type === 'Images' && <Image className="h-4 w-4 text-blue-400" />}
                    {type.type === 'Stories' && <Camera className="h-4 w-4 text-green-400" />}
                    <span className="text-white font-medium">{type.type}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{type.count} posts</p>
                    <p className="text-sm text-gray-400">${type.earnings.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-luxury-dark rounded-full h-2">
                    <div 
                      className="bg-luxury-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${type.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-12">{type.percentage}%</span>
                </div>
                <div className="text-sm text-gray-400">
                  Avg. views: {type.avgViews.toLocaleString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};