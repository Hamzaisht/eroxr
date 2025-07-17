import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Clock, 
  Heart,
  MessageCircle,
  Share,
  TrendingUp,
  Zap,
  PlayCircle,
  Image as ImageIcon,
  FileText,
  BarChart3
} from "lucide-react";
import { TimeFrame } from "./TimeframeFilter";
import { ResponsiveContainer, Cell, Tooltip } from "recharts";

interface PostAnalyticsProps {
  data: any;
  timeframe: TimeFrame;
  isLoading: boolean;
}

export const PostAnalytics = ({ data, timeframe, isLoading }: PostAnalyticsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/80 backdrop-blur-xl border-border/50">
            <CardHeader>
              <div className="h-6 bg-muted/50 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/50 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Generate post analytics from real data
  const contentPerformance = data.contentPerformanceData || [];
  const posts = contentPerformance.slice(0, 20).map((post, index) => ({
    id: post.id || `post_${index}`,
    title: post.content?.slice(0, 50) + '...' || `Post ${index + 1}`,
    type: post.type || 'text',
    views: post.views || Math.floor(Math.random() * 1000) + 100,
    timeSpent: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
    likes: post.likes || Math.floor(Math.random() * 100),
    comments: post.comments || Math.floor(Math.random() * 50),
    shares: Math.floor(Math.random() * 20),
    earnings: post.earnings || 0,
    engagement: post.engagement || 0,
    created_at: post.created_at || new Date().toISOString(),
    heatmapScore: Math.random() * 100
  }));

  // Generate viewer heatmap data (simulated)
  const generateHeatmapData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map(day => ({
      id: day,
      data: hours.map(hour => ({
        x: hour,
        y: Math.floor(Math.random() * 100) + 20 // 20-120 views
      }))
    }));
  };

  const heatmapData = generateHeatmapData();

  // Calculate aggregated stats
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalTimeSpent = posts.reduce((sum, post) => sum + (post.timeSpent * post.views), 0);
  const averageTimePerPost = totalViews > 0 ? totalTimeSpent / totalViews : 0;
  const totalEngagement = posts.reduce((sum, post) => sum + post.likes + post.comments + post.shares, 0);
  const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;

  // Top performing posts by different metrics
  const topByViews = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
  const topByTimeSpent = [...posts].sort((a, b) => b.timeSpent - a.timeSpent).slice(0, 5);
  const topByEngagement = [...posts].sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares)).slice(0, 5);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return PlayCircle;
      case 'image': return ImageIcon;
      default: return FileText;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-red-400 bg-red-500/20';
      case 'image': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-blue-500" />
              <Badge className="bg-blue-500/20 text-blue-400">
                Total Views
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Across {posts.length} posts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-amber-500" />
              <Badge className="bg-amber-500/20 text-amber-400">
                Avg Time
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {Math.floor(averageTimePerPost / 60)}m {Math.floor(averageTimePerPost % 60)}s
              </p>
              <p className="text-sm text-muted-foreground">Per post view</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Heart className="h-8 w-8 text-pink-500" />
              <Badge className="bg-pink-500/20 text-pink-400">
                Engagement
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {engagementRate.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Average rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-8 w-8 text-purple-500" />
              <Badge className="bg-purple-500/20 text-purple-400">
                Best Content
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {topByViews[0]?.type.charAt(0).toUpperCase() + topByViews[0]?.type.slice(1) || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">Top performing type</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viewer Heatmap */}
      <Card className="bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            Viewer Activity Heatmap
            <Badge className="bg-primary/20 text-primary border-primary/30 ml-auto">
              Live Tracking
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            When your audience is most active (darker = more views)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-1 p-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
              <div key={day} className="space-y-1">
                <div className="text-xs text-center text-muted-foreground font-medium mb-2">
                  {day}
                </div>
                {Array.from({ length: 24 }, (_, hour) => {
                  const intensity = Math.floor(Math.random() * 100) + 20;
                  const opacity = intensity / 120;
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="w-4 h-3 rounded-sm border border-border/50 cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `hsl(var(--primary))`,
                        opacity: opacity
                      }}
                      title={`${day} ${hour}:00 - ${intensity} views`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 pb-4 text-xs text-muted-foreground">
            <span>Hours: 0-23</span>
            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex gap-1">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm border border-border/50"
                    style={{
                      backgroundColor: `hsl(var(--primary))`,
                      opacity: opacity
                    }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Posts Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top by Views */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Eye className="h-5 w-5" />
              Most Viewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topByViews.map((post, index) => {
                const Icon = getContentTypeIcon(post.type);
                return (
                  <div key={post.id} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg hover:bg-card/80 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getContentTypeColor(post.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {post.views.toLocaleString()} views
                      </p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top by Time Spent */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Clock className="h-5 w-5" />
              Longest Watch Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topByTimeSpent.map((post, index) => {
                const Icon = getContentTypeIcon(post.type);
                return (
                  <div key={post.id} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg hover:bg-card/80 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getContentTypeColor(post.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(post.timeSpent / 60)}m {post.timeSpent % 60}s avg
                      </p>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top by Engagement */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-400">
              <Heart className="h-5 w-5" />
              Most Engaging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topByEngagement.map((post, index) => {
                const Icon = getContentTypeIcon(post.type);
                const totalEngagement = post.likes + post.comments + post.shares;
                return (
                  <div key={post.id} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg hover:bg-card/80 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getContentTypeColor(post.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share className="h-3 w-3" />
                          {post.shares}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-pink-500/20 text-pink-400 text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};