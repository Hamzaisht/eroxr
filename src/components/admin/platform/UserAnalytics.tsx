
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  BarChart,
  Heart,
  MessageSquare,
  Eye,
  DollarSign,
  Map,
  Clock,
  ArrowLeft,
  FolderHeart,
  Image,
  Video,
  Calendar,
  Filter,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/ui/LoadingState";
import { format, subDays } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  Legend
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export const UserAnalytics = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("30"); // Default 30 days
  const [selectedTab, setSelectedTab] = useState("overview");

  // Calculate date range based on selected time period
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, parseInt(timeRange));
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };
  };

  // Fetch user profile information
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles!inner (
            role
          )
        `)
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });

  // Fetch user analytics data
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["user-analytics", userId, timeRange],
    queryFn: async () => {
      if (!userId) return null;
      const dateRange = getDateRange();

      const [
        postsData,
        likesData,
        commentsData,
        viewsData,
        tipsData,
        messagesData,
        datingViewsData,
        contentTypesData,
      ] = await Promise.all([
        // Posts created by user
        supabase
          .from("posts")
          .select("id, created_at, likes_count, comments_count, view_count")
          .eq("creator_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Likes by user
        supabase
          .from("post_likes")
          .select("id, created_at, posts!inner(creator_id)")
          .eq("user_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Comments by user  
        supabase
          .from("comments")
          .select("id, created_at, posts!inner(creator_id)")
          .eq("user_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Post views (approximate from post_media_actions)
        supabase
          .from("post_media_actions")
          .select("id, created_at, action_type")
          .eq("user_id", userId)
          .eq("action_type", "view")
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Tips sent by user  
        supabase
          .from("tips")
          .select("id, amount, created_at, recipient_id")
          .eq("sender_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Messages sent by user  
        supabase
          .from("direct_messages")
          .select("id, created_at, message_type, recipient_id")
          .eq("sender_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Dating ad views
        supabase
          .from("dating_ads")
          .select("id, view_count, click_count, created_at")
          .eq("user_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Content type preferences (posts vs dating vs stories)
        supabase
          .from("post_media_actions")
          .select("id, post_id, created_at")
          .eq("user_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end)
      ]);

      // Extract most viewed profiles
      const { data: mostViewedProfiles } = await supabase
        .from("post_media_actions")
        .select(`
          id, 
          created_at,
          posts!inner (
            creator_id,
            profiles:creator_id (
              username,
              avatar_url
            )
          )
        `)
        .eq("user_id", userId)
        .eq("action_type", "view")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      // Process most viewed profiles
      const profileViewCount: { [key: string]: { count: number, username: string, avatar_url: string | null } } = {};
      
      if (mostViewedProfiles) {
        mostViewedProfiles.forEach((view) => {
          const creatorId = view.posts.creator_id;
          if (creatorId && creatorId !== userId) { // Don't count self-views
            if (!profileViewCount[creatorId]) {
              profileViewCount[creatorId] = { 
                count: 0, 
                username: view.posts.profiles.username, 
                avatar_url: view.posts.profiles.avatar_url 
              };
            }
            profileViewCount[creatorId].count++;
          }
        });
      }
      
      const topProfiles = Object.entries(profileViewCount)
        .map(([id, data]) => ({ 
          id, 
          ...data 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Create activity timeline
      const createTimeline = () => {
        // Generate date range array
        const days = parseInt(timeRange);
        const timeline: { [key: string]: any } = {};
        
        for (let i = 0; i < days; i++) {
          const date = subDays(new Date(), i);
          const dateStr = format(date, "yyyy-MM-dd");
          timeline[dateStr] = {
            date: dateStr,
            posts: 0,
            likes: 0,
            comments: 0,
            views: 0,
            messages: 0
          };
        }
        
        // Add post counts to timeline
        postsData.data?.forEach(post => {
          const dateStr = format(new Date(post.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].posts++;
          }
        });
        
        // Add like counts to timeline
        likesData.data?.forEach(like => {
          const dateStr = format(new Date(like.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].likes++;
          }
        });
        
        // Add comment counts to timeline
        commentsData.data?.forEach(comment => {
          const dateStr = format(new Date(comment.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].comments++;
          }
        });
        
        // Add view counts to timeline
        viewsData.data?.forEach(view => {
          const dateStr = format(new Date(view.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].views++;
          }
        });
        
        // Add message counts to timeline
        messagesData.data?.forEach(message => {
          const dateStr = format(new Date(message.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].messages++;
          }
        });
        
        return Object.values(timeline).reverse();
      };

      const timeline = createTimeline();

      // Calculate content type distribution
      const contentDistribution = [
        { name: "Posts", value: postsData.data?.length || 0 },
        { name: "Dating", value: datingViewsData.data?.length || 0 },
        { name: "Messages", value: messagesData.data?.length || 0 }
      ];

      // Calculate total statistics
      const totalPosts = postsData.data?.length || 0;
      const totalLikes = likesData.data?.length || 0; 
      const totalComments = commentsData.data?.length || 0;
      const totalViews = viewsData.data?.length || 0;
      const totalMessages = messagesData.data?.length || 0;
      
      // Calculate tips amount
      const tipsAmount = tipsData.data?.reduce((sum, tip) => sum + (parseFloat(tip.amount) || 0), 0) || 0;
      
      // Get unique recipients
      const uniqueMessageRecipients = new Set(messagesData.data?.map(m => m.recipient_id) || []);
      
      // Get last active date
      const allDates = [
        ...(postsData.data?.map(p => new Date(p.created_at).getTime()) || []),
        ...(likesData.data?.map(l => new Date(l.created_at).getTime()) || []),
        ...(commentsData.data?.map(c => new Date(c.created_at).getTime()) || []),
        ...(viewsData.data?.map(v => new Date(v.created_at).getTime()) || []),
        ...(messagesData.data?.map(m => new Date(m.created_at).getTime()) || [])
      ];
      
      const lastActiveTimestamp = allDates.length > 0 ? Math.max(...allDates) : null;
      const lastActive = lastActiveTimestamp ? new Date(lastActiveTimestamp) : null;

      return {
        totalPosts,
        totalLikes,
        totalComments,
        totalViews,
        totalMessages,
        tipsAmount,
        uniqueMessageRecipients: uniqueMessageRecipients.size,
        contentDistribution,
        timeline,
        topProfiles,
        lastActive
      };
    },
    enabled: !!userId,
  });

  const isLoading = isProfileLoading || isAnalyticsLoading;

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Select a User</h2>
        <p className="text-muted-foreground max-w-md">
          Please select a user from the Users Management tab to view their detailed analytics.
        </p>
        <Button
          variant="outline"
          className="mt-4 bg-[#0D1117]/50"
          onClick={() => navigate("/admin/platform/users")}
        >
          Go to Users Management
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState message="Loading user analytics..." />;
  }

  if (!profile || !analytics) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground">
          Could not find analytics data for this user.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/admin/platform/users")}
        >
          Back to Users
        </Button>
      </div>
    );
  }

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  return (
    <div className="space-y-6">
      {/* User profile header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/platform/users")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-purple-500/50">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.username || "User"} />
            <AvatarFallback>{profile.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {profile.username || "Unnamed User"}
              <Badge 
                variant="outline" 
                className={
                  profile.user_roles.role === 'super_admin' 
                    ? 'border-purple-500 text-purple-500' 
                    : profile.user_roles.role === 'creator' 
                      ? 'border-blue-500 text-blue-500' 
                      : 'border-gray-500 text-gray-500'
                }
              >
                {profile.user_roles.role}
              </Badge>
              {profile.is_suspended && (
                <Badge variant="destructive">Banned</Badge>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              {profile.first_name && profile.last_name 
                ? `${profile.first_name} ${profile.last_name} · ` 
                : ""}
              Member since {format(new Date(profile.created_at), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#0D1117]/50">
                <Filter className="mr-2 h-4 w-4" />
                Last {timeRange} Days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange("7")}>
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("30")}>
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("90")}>
                Last 90 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Analytics tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-white/10 gap-1">
        <Button
          variant={selectedTab === "overview" ? "secondary" : "ghost"}
          className={selectedTab === "overview" ? "bg-purple-900/20" : ""}
          onClick={() => setSelectedTab("overview")}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Overview
        </Button>
        <Button
          variant={selectedTab === "activity" ? "secondary" : "ghost"}
          className={selectedTab === "activity" ? "bg-purple-900/20" : ""}
          onClick={() => setSelectedTab("activity")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Activity Timeline
        </Button>
        <Button
          variant={selectedTab === "content" ? "secondary" : "ghost"}
          className={selectedTab === "content" ? "bg-purple-900/20" : ""}
          onClick={() => setSelectedTab("content")}
        >
          <FolderHeart className="mr-2 h-4 w-4" />
          Content Preferences
        </Button>
        <Button
          variant={selectedTab === "profiles" ? "secondary" : "ghost"}
          className={selectedTab === "profiles" ? "bg-purple-900/20" : ""}
          onClick={() => setSelectedTab("profiles")}
        >
          <UserCheck className="mr-2 h-4 w-4" />
          Most Viewed Profiles
        </Button>
      </div>
      
      {/* Overview tab content */}
      {selectedTab === "overview" && (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#0D1117]/60 border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Total Activity</CardDescription>
                <CardTitle className="text-3xl flex items-center">
                  <div className="p-2 mr-3 rounded-full bg-blue-900/20">
                    <Eye className="h-5 w-5 text-blue-400" />
                  </div>
                  {analytics.totalViews + analytics.totalLikes + analytics.totalComments}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {analytics.totalViews} views · {analytics.totalLikes} likes · {analytics.totalComments} comments
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D1117]/60 border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Content Created</CardDescription>
                <CardTitle className="text-3xl flex items-center">
                  <div className="p-2 mr-3 rounded-full bg-green-900/20">
                    <Image className="h-5 w-5 text-green-400" />
                  </div>
                  {analytics.totalPosts}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {analytics.totalPosts > 0 
                    ? `Avg. ${Math.round((analytics.totalLikes + analytics.totalComments) / analytics.totalPosts)} engagements per post`
                    : 'No posts created during this period'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D1117]/60 border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Messages Sent</CardDescription>
                <CardTitle className="text-3xl flex items-center">
                  <div className="p-2 mr-3 rounded-full bg-purple-900/20">
                    <MessageSquare className="h-5 w-5 text-purple-400" />
                  </div>
                  {analytics.totalMessages}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  To {analytics.uniqueMessageRecipients} unique recipients
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D1117]/60 border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Tips Sent</CardDescription>
                <CardTitle className="text-3xl flex items-center">
                  <div className="p-2 mr-3 rounded-full bg-amber-900/20">
                    <DollarSign className="h-5 w-5 text-amber-400" />
                  </div>
                  {analytics.tipsAmount.toFixed(2)} SEK
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Last active: {analytics.lastActive 
                    ? format(new Date(analytics.lastActive), "MMM d, yyyy") 
                    : 'Unknown'}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content distribution chart */}
          <Card className="bg-[#0D1117]/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Usage Distribution</CardTitle>
              <CardDescription>
                How this user is interacting with different sections of the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.contentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.contentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} interactions`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Activity timeline tab content */}
      {selectedTab === "activity" && (
        <div className="space-y-6">
          <Card className="bg-[#0D1117]/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <CardDescription>
                User's engagement over the last {timeRange} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics.timeline}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(new Date(date), "MMM d")}
                      tickMargin={10}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (typeof name === 'string') {
                          return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(date) => format(new Date(date as string), "MMMM d, yyyy")}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Views"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="likes" 
                      stroke="#82ca9d"
                      name="Likes" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="comments" 
                      stroke="#ffc658"
                      name="Comments" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#ff8042"
                      name="Messages" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="posts" 
                      stroke="#0088FE"
                      name="Posts" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#0D1117]/60 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Daily Activity</CardTitle>
                <CardDescription>
                  When this user is most active
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={analytics.timeline.slice(0, 7)} // Last 7 days regardless of time range
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(new Date(date), "EEE")}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (typeof name === 'string') {
                            return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                          }
                          return [value, name];
                        }}
                        labelFormatter={(date) => format(new Date(date as string), "EEEE, MMMM d")}
                      />
                      <Legend />
                      <Bar 
                        dataKey="views" 
                        fill="#8884d8" 
                        name="Views" 
                      />
                      <Bar 
                        dataKey="likes" 
                        fill="#82ca9d" 
                        name="Likes" 
                      />
                      <Bar 
                        dataKey="messages" 
                        fill="#ff8042" 
                        name="Messages" 
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D1117]/60 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Activity Stats</CardTitle>
                <CardDescription>
                  Summary of user's recent platform interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last Active</span>
                    </div>
                    <span className="font-medium">
                      {analytics.lastActive 
                        ? format(new Date(analytics.lastActive), "PPpp")
                        : 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Views</span>
                    </div>
                    <span className="font-medium">{analytics.totalViews}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Likes</span>
                    </div>
                    <span className="font-medium">{analytics.totalLikes}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Unique Chats</span>
                    </div>
                    <span className="font-medium">{analytics.uniqueMessageRecipients}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Tips Sent</span>
                    </div>
                    <span className="font-medium">{analytics.tipsAmount.toFixed(2)} SEK</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Content preferences tab content */}
      {selectedTab === "content" && (
        <div className="space-y-6">
          <Card className="bg-[#0D1117]/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Content Type Preferences</CardTitle>
              <CardDescription>
                Distribution of content types the user engages with
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    layout="vertical"
                    data={analytics.contentDistribution}
                    margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} interactions`, ""]}
                    />
                    <Bar 
                      dataKey="value" 
                      name="Interactions" 
                      radius={[0, 4, 4, 0]}
                    >
                      {analytics.contentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#0D1117]/60 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Feed Posts</CardTitle>
                  <Video className="h-5 w-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{analytics.contentDistribution[0].value}</div>
                <div className="text-sm text-muted-foreground">
                  interactions with standard posts
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D1117]/60 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Dating Ads</CardTitle>
                  <Heart className="h-5 w-5 text-pink-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{analytics.contentDistribution[1].value}</div>
                <div className="text-sm text-muted-foreground">
                  interactions with dating profiles
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D1117]/60 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Direct Messages</CardTitle>
                  <MessageSquare className="h-5 w-5 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{analytics.contentDistribution[2].value}</div>
                <div className="text-sm text-muted-foreground">
                  interactions with private messages
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Most viewed profiles tab content */}
      {selectedTab === "profiles" && (
        <div className="space-y-6">
          <Card className="bg-[#0D1117]/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Most Viewed Profiles</CardTitle>
              <CardDescription>
                Creators this user engages with most frequently
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topProfiles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>View Count</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.topProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
                              <AvatarFallback>{profile.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{profile.username}</span>
                          </div>
                        </TableCell>
                        <TableCell>{profile.count}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-purple-900/30 rounded-full w-24">
                              <div 
                                className="h-2 bg-purple-500 rounded-full" 
                                style={{ 
                                  width: `${(profile.count / analytics.topProfiles[0].count) * 100}%`
                                }}
                              />
                            </div>
                            <span className="text-sm">
                              {Math.round((profile.count / analytics.totalViews) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-[#0D1117]/50"
                            onClick={() => navigate(`/profile/${profile.id}`)}
                          >
                            <User className="mr-1 h-3.5 w-3.5" />
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No profile view data available for this time period
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
