
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trash2,
  Search,
  Eye,
  RotateCcw,
  Filter,
  AlertTriangle,
  MessageSquare,
  Image,
  Video,
  UserX,
  Clock,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useGhostMode } from "@/hooks/useGhostMode";
import { LoadingState } from "@/components/ui/LoadingState";

// Define proper types for our data
interface ProfileData {
  username?: string;
  avatar_url?: string | null;
}

interface DeletedContentItem {
  id: string;
  created_at: string;
  last_modified_by?: string;
  user_id: string;
  profiles?: ProfileData;
  content_type: string;
  title?: string; // Some items might not have a title
  sender_id?: string; // For messages
  creator_id?: string; // For stories
}

export const DeletedContent = () => {
  const navigate = useNavigate();
  const { isGhostMode } = useGhostMode();
  const [contentType, setContentType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("30");

  // Calculate date range based on selected time period
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };
  };

  // Fetch deleted content based on filters
  const { data: deletedContent, isLoading } = useQuery({
    queryKey: ["deleted-content", contentType, timeRange, searchTerm],
    queryFn: async () => {
      const dateRange = getDateRange();
      
      const buildQuery = (table: string) => {
        let query = supabase
          .from(table)
          .select(`
            id,
            created_at,
            last_modified_by,
            user_id,
            profiles:user_id (username, avatar_url)
          `)
          .eq("is_active", false)
          .gte("updated_at", dateRange.start)
          .lte("updated_at", dateRange.end);
          
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }
        
        return query;
      };

      // Fetch deleted posts
      const fetchDeletedPosts = async () => {
        if (contentType === "all" || contentType === "posts") {
          const { data, error } = await buildQuery("posts");
          if (error) throw error;
          return data.map((post: any) => ({
            ...post,
            content_type: "post",
            title: post.title || "Post", // Provide default title if missing
            profiles: post.profiles || undefined 
          }));
        }
        return [];
      };

      // Fetch deleted dating ads
      const fetchDeletedDatingAds = async () => {
        if (contentType === "all" || contentType === "dating") {
          const { data, error } = await buildQuery("dating_ads");
          if (error) throw error;
          return data.map((ad: any) => ({
            ...ad,
            content_type: "dating",
            title: ad.title || "Dating Ad",
            profiles: ad.profiles || undefined
          }));
        }
        return [];
      };

      // Fetch deleted messages
      const fetchDeletedMessages = async () => {
        if (contentType === "all" || contentType === "messages") {
          const { data, error } = await supabase
            .from("direct_messages")
            .select(`
              id,
              created_at,
              content,
              sender_id,
              profiles:sender_id (username, avatar_url)
            `)
            .eq("is_expired", true)
            .gte("created_at", dateRange.start)
            .lte("created_at", dateRange.end);
          
          if (error) throw error;
          
          return data.map((message: any) => ({
            ...message,
            content_type: "message",
            title: "Message",
            user_id: message.sender_id,
            profiles: message.profiles || undefined
          }));
        }
        return [];
      };

      // Fetch deleted stories
      const fetchDeletedStories = async () => {
        if (contentType === "all" || contentType === "stories") {
          const { data, error } = await supabase
            .from("stories")
            .select(`
              id,
              created_at,
              creator_id,
              profiles:creator_id (username, avatar_url)
            `)
            .eq("is_active", false)
            .gte("created_at", dateRange.start)
            .lte("created_at", dateRange.end);
          
          if (error) throw error;
          
          return data.map((story: any) => ({
            ...story,
            content_type: "story",
            title: "Story",
            user_id: story.creator_id,
            profiles: story.profiles || undefined
          }));
        }
        return [];
      };

      // Combine all deleted content
      const [posts, datingAds, messages, stories] = await Promise.all([
        fetchDeletedPosts(),
        fetchDeletedDatingAds(),
        fetchDeletedMessages(),
        fetchDeletedStories(),
      ]);

      // Sort combined content by date (newest first)
      return [...posts, ...datingAds, ...messages, ...stories].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  // Function to restore content
  const handleRestore = async (item: DeletedContentItem) => {
    try {
      let table = "";
      
      switch (item.content_type) {
        case "post":
          table = "posts";
          break;
        case "dating":
          table = "dating_ads";
          break;
        case "story":
          table = "stories";
          break;
        case "message":
          table = "direct_messages";
          break;
        default:
          throw new Error("Unknown content type");
      }
      
      // Update is_active field or is_expired for messages
      const { error } = await supabase
        .from(table)
        .update(
          item.content_type === "message" 
            ? { is_expired: false } 
            : { is_active: true }
        )
        .eq("id", item.id);
      
      if (error) throw error;
      
      // Log admin action
      await supabase.from("admin_audit_logs").insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action: "restore_content",
        details: {
          content_id: item.id,
          content_type: item.content_type,
          restored_at: new Date().toISOString()
        }
      });
      
      // Refresh data
      // This will be handled by the React Query invalidation in a real implementation
      
    } catch (error) {
      console.error("Error restoring content:", error);
    }
  };

  // Function to permanently delete content
  const handlePermanentDelete = async (item: DeletedContentItem) => {
    try {
      let table = "";
      
      switch (item.content_type) {
        case "post":
          table = "posts";
          break;
        case "dating":
          table = "dating_ads";
          break;
        case "story":
          table = "stories";
          break;
        case "message":
          table = "direct_messages";
          break;
        default:
          throw new Error("Unknown content type");
      }
      
      // Permanently delete the record
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", item.id);
      
      if (error) throw error;
      
      // Log admin action
      await supabase.from("admin_audit_logs").insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action: "permanent_delete",
        details: {
          content_id: item.id,
          content_type: item.content_type,
          deleted_at: new Date().toISOString()
        }
      });
      
      // Refresh data
      // This will be handled by the React Query invalidation in a real implementation
      
    } catch (error) {
      console.error("Error permanently deleting content:", error);
    }
  };

  // Function to view user profile
  const handleViewUser = (userId: string) => {
    navigate(`/admin/platform/analytics/${userId}`);
  };

  // If loading, show loading state
  if (isLoading) {
    return <LoadingState message="Loading deleted content..." />;
  }

  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <Image className="w-4 h-4" />;
      case "dating":
        return <Heart className="w-4 h-4" />;
      case "message":
        return <MessageSquare className="w-4 h-4" />;
      case "story":
        return <Video className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Ghost Mode Warning Banner */}
      <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
        <span>Ghost Mode - Viewing Deleted Content</span>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="posts">Posts</SelectItem>
            <SelectItem value="dating">Dating Ads</SelectItem>
            <SelectItem value="messages">Messages</SelectItem>
            <SelectItem value="stories">Stories</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="365">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Table */}
      <Card className="bg-[#161B22]/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-400" />
            Deleted Content
          </CardTitle>
          <CardDescription>
            View, restore, or permanently delete content that has been removed from the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deletedContent && deletedContent.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Deleted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedContent.map((item: DeletedContentItem) => (
                  <TableRow key={`${item.content_type}-${item.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-full bg-[#0D1117]">
                          {getContentTypeIcon(item.content_type)}
                        </div>
                        <span className="font-medium">
                          {item.title || item.content_type}
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {item.content_type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.profiles?.avatar_url || undefined} />
                          <AvatarFallback>{item.profiles?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.profiles?.username || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground">
                            ID: {item.user_id?.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(item.created_at), "PPp")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRestore(item)}
                          className="bg-[#0D1117]/50"
                        >
                          <RotateCcw className="mr-1 h-3.5 w-3.5" />
                          Restore
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handlePermanentDelete(item)}
                          className="bg-red-900/30 text-red-400 border-red-800/50 hover:bg-red-900/50"
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Purge
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUser(item.user_id)}
                          className="bg-[#0D1117]/50"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          User
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trash2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No deleted content found for the selected filters</p>
              <p className="text-sm mt-1">Try changing your search terms or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
