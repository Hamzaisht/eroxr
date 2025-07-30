import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  FileText, 
  Image, 
  Video, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle,
  Download,
  Filter,
  Calendar
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
  AreaChart
} from "recharts";

interface ContentAnalyticsProps {
  data: {
    stats: any;
    contentAnalyticsData?: any;
    contentPerformanceData: any[];
    contentTypeData: any[];
  };
  isLoading: boolean;
}

export const ContentAnalytics = ({ data, isLoading }: ContentAnalyticsProps) => {
  const [timeFilter, setTimeFilter] = useState("30d");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 bg-luxury-darker/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const contentData = data.contentAnalyticsData;
  const hasRealContentData = contentData && Object.keys(contentData).length > 0;

  // Content performance metrics
  const contentStats = [
    {
      title: "Total Content",
      value: hasRealContentData ? contentData.total_posts : data.stats?.totalContent || 0,
      change: "+12%",
      icon: FileText,
      color: "text-blue-400"
    },
    {
      title: "Total Views",
      value: hasRealContentData ? contentData.total_views?.toLocaleString() : data.stats?.totalViews?.toLocaleString() || "0",
      change: "+25%",
      icon: Eye,
      color: "text-green-400"
    },
    {
      title: "Avg Engagement",
      value: `${hasRealContentData ? contentData.avg_engagement_rate?.toFixed(1) : data.stats?.engagementRate?.toFixed(1) || "0"}%`,
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-400"
    },
    {
      title: "Best Performing",
      value: hasRealContentData ? contentData.content_type_breakdown?.videos > contentData.content_type_breakdown?.images ? "Videos" : "Images" : "Videos",
      change: "Video content",
      icon: Video,
      color: "text-pink-400"
    }
  ];

  // Posting schedule analysis
  const scheduleData = hasRealContentData && contentData.posting_schedule_analysis ? 
    Object.entries(contentData.posting_schedule_analysis).map(([day, stats]: [string, any]) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseInt(day)],
      posts: stats.posts,
      engagement: stats.avg_engagement
    })) : 
    [
      { day: 'Mon', posts: 8, engagement: 65 },
      { day: 'Tue', posts: 12, engagement: 72 },
      { day: 'Wed', posts: 15, engagement: 78 },
      { day: 'Thu', posts: 18, engagement: 85 },
      { day: 'Fri', posts: 22, engagement: 92 },
      { day: 'Sat', posts: 16, engagement: 88 },
      { day: 'Sun', posts: 10, engagement: 70 }
    ];

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-between items-start">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Content Analytics</h2>
          <p className="text-gray-400 text-sm sm:text-base">Analyze your content performance and optimization opportunities</p>
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

      {/* Content Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {contentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-luxury-darker border-luxury-neutral/10 hover:border-luxury-primary/30 transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Content Type Distribution */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-luxury-primary" />
              Content Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.contentTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Posting Schedule */}
        <Card className="bg-luxury-darker border-luxury-neutral/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-luxury-primary" />
              Weekly Posting Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scheduleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="posts" fill="#8b5cf6" name="Posts" />
                  <Bar dataKey="engagement" fill="#06b6d4" name="Engagement %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-luxury-primary" />
            Top Performing Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {data.contentPerformanceData.slice(0, 10).map((content, index) => (
              <div key={content.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-luxury-dark rounded-lg border border-luxury-neutral/10 gap-3">
                <div className="flex items-start sm:items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-luxury-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {content.type === 'video' ? <Video className="h-5 w-5 md:h-6 md:w-6 text-luxury-primary" /> :
                     content.type === 'image' ? <Image className="h-5 w-5 md:h-6 md:w-6 text-luxury-primary" /> :
                     <FileText className="h-5 w-5 md:h-6 md:w-6 text-luxury-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm md:text-base line-clamp-2">
                      {content.content?.slice(0, 50)}...
                    </p>
                    <p className="text-gray-400 text-xs md:text-sm">
                      {new Date(content.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-6 text-xs md:text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Eye className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">{content.views?.toLocaleString() || 0}</span>
                    <span className="sm:hidden">{content.views ? (content.views > 1000 ? `${(content.views/1000).toFixed(1)}k` : content.views) : 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Heart className="h-3 w-3 md:h-4 md:w-4" />
                    {content.likes || 0}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                    {content.comments || 0}
                  </div>
                  <Badge className="bg-luxury-primary/20 text-luxury-primary text-xs">
                    ${content.earnings?.toFixed(2) || "0.00"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};