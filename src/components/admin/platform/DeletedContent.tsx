
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGhostMode } from "@/hooks/useGhostMode";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  Trash2, 
  RotateCcw, 
  Eye, 
  Ghost,
  Calendar,
  User,
  LayoutList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format, subDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/LoadingState";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DeletedContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [timePeriod, setTimePeriod] = useState("7");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [viewContentDialog, setViewContentDialog] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [permanentDeleteDialog, setPermanentDeleteDialog] = useState(false);
  const { isGhostMode } = useGhostMode();
  const { toast } = useToast();

  // Calculate date range based on selected time period
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, parseInt(timePeriod));
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["deleted-content", searchTerm, contentTypeFilter, timePeriod],
    queryFn: async () => {
      const dateRange = getDateRange();
      
      // Create queries for each content type
      const queries = [];
      
      // Filter content types based on selection
      const contentTypes = contentTypeFilter === "all" 
        ? ["posts", "dating_ads", "direct_messages", "stories"] 
        : [contentTypeFilter];
      
      // Fetch deleted posts
      if (contentTypes.includes("posts") || contentTypes.includes("all")) {
        const postsQuery = supabase
          .from("posts")
          .select(`
            id,
            creator_id,
            content,
            media_url,
            created_at,
            updated_at,
            video_urls,
            profiles:creator_id (username, avatar_url)
          `)
          .is("deleted_at", null)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end)
          .order("created_at", { ascending: false });
          
        if (searchTerm) {
          postsQuery.or(`content.ilike.%${searchTerm}%,profiles.username.ilike.%${searchTerm}%`);
        }
        
        queries.push(
          postsQuery.then(({ data, error }) => {
            if (error) console.error("Error fetching deleted posts:", error);
            return (data || []).map(item => ({
              ...item,
              content_type: "post"
            }));
          })
        );
      }
      
      // Fetch deleted dating ads
      if (contentTypes.includes("dating_ads") || contentTypes.includes("all")) {
        const adsQuery = supabase
          .from("dating_ads")
          .select(`
            id,
            user_id,
            title,
            description,
            about_me,
            created_at,
            updated_at,
            profiles:user_id (username, avatar_url)
          `)
          .is("deleted_at", null)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end)
          .order("created_at", { ascending: false });
          
        if (searchTerm) {
          adsQuery.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,profiles.username.ilike.%${searchTerm}%`);
        }
        
        queries.push(
          adsQuery.then(({ data, error }) => {
            if (error) console.error("Error fetching deleted dating ads:", error);
            return (data || []).map(item => ({
              ...item,
              content_type: "dating_ad"
            }));
          })
        );
      }
      
      // Fetch deleted messages
      if (contentTypes.includes("direct_messages") || contentTypes.includes("all")) {
        const messagesQuery = supabase
          .from("direct_messages")
          .select(`
            id,
            sender_id,
            recipient_id,
            content,
            media_url,
            created_at,
            sender:sender_id (username, avatar_url),
            recipient:recipient_id (username, avatar_url)
          `)
          .is("deleted_at", null)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end)
          .order("created_at", { ascending: false });
          
        if (searchTerm) {
          messagesQuery.or(`content.ilike.%${searchTerm}%,sender.username.ilike.%${searchTerm}%,recipient.username.ilike.%${searchTerm}%`);
        }
        
        queries.push(
          messagesQuery.then(({ data, error }) => {
            if (error) console.error("Error fetching deleted messages:", error);
            return (data || []).map(item => ({
              ...item,
              content_type: "message"
            }));
          })
        );
      }
      
      // Fetch deleted stories
      if (contentTypes.includes("stories") || contentTypes.includes("all")) {
        const storiesQuery = supabase
          .from("stories")
          .select(`
            id,
            creator_id,
            media_url,
            video_url,
            created_at,
            expires_at,
            profiles:creator_id (username, avatar_url)
          `)
          .eq("is_active", false)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end)
          .order("created_at", { ascending: false });
          
        if (searchTerm) {
          storiesQuery.or(`profiles.username.ilike.%${searchTerm}%`);
        }
        
        queries.push(
          storiesQuery.then(({ data, error }) => {
            if (error) console.error("Error fetching deleted stories:", error);
            return (data || []).map(item => ({
              ...item,
              content_type: "story"
            }));
          })
        );
      }
      
      // Combine results from all queries
      const results = await Promise.all(queries);
      return results.flat();
    },
    enabled: isGhostMode, // Only run this query if ghost mode is active
  });

  const handleViewContent = (content: any) => {
    setSelectedContent(content);
    setViewContentDialog(true);
  };

  const handleRestoreContent = async () => {
    if (!selectedContent) return;
    
    try {
      let result;
      
      switch (selectedContent.content_type) {
        case "post":
          result = await supabase
            .from("posts")
            .update({ deleted_at: null })
            .eq("id", selectedContent.id);
          break;
        case "dating_ad":
          result = await supabase
            .from("dating_ads")
            .update({ deleted_at: null })
            .eq("id", selectedContent.id);
          break;
        case "message":
          result = await supabase
            .from("direct_messages")
            .update({ deleted_at: null })
            .eq("id", selectedContent.id);
          break;
        case "story":
          result = await supabase
            .from("stories")
            .update({ is_active: true })
            .eq("id", selectedContent.id);
          break;
      }
      
      if (result?.error) throw result.error;

      // Log admin action
      await supabase.from("admin_audit_logs").insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: "content_restored",
        details: {
          content_id: selectedContent.id,
          content_type: selectedContent.content_type,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "Content Restored",
        description: "The content has been successfully restored.",
      });

      setRestoreDialog(false);
      refetch();
    } catch (error) {
      console.error("Error restoring content:", error);
      toast({
        title: "Restore Failed",
        description: "There was an error restoring the content.",
        variant: "destructive",
      });
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedContent) return;
    
    try {
      let result;
      
      switch (selectedContent.content_type) {
        case "post":
          result = await supabase
            .from("posts")
            .delete()
            .eq("id", selectedContent.id);
          break;
        case "dating_ad":
          result = await supabase
            .from("dating_ads")
            .delete()
            .eq("id", selectedContent.id);
          break;
        case "message":
          result = await supabase
            .from("direct_messages")
            .delete()
            .eq("id", selectedContent.id);
          break;
        case "story":
          result = await supabase
            .from("stories")
            .delete()
            .eq("id", selectedContent.id);
          break;
      }
      
      if (result?.error) throw result.error;

      // Log admin action
      await supabase.from("admin_audit_logs").insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: "content_permanently_deleted",
        details: {
          content_id: selectedContent.id,
          content_type: selectedContent.content_type,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "Content Permanently Deleted",
        description: "The content has been permanently removed from the database.",
      });

      setPermanentDeleteDialog(false);
      refetch();
    } catch (error) {
      console.error("Error permanently deleting content:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the content.",
        variant: "destructive",
      });
    }
  };

  if (!isGhostMode) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center space-y-4">
        <Ghost className="mx-auto h-12 w-12 text-red-400" />
        <h2 className="text-xl font-semibold text-white">Ghost Mode Required</h2>
        <p className="max-w-md mx-auto text-red-200">
          You must enable Ghost Mode to view deleted content. This ensures proper audit logging and security.
        </p>
        <Button 
          variant="outline" 
          className="border-red-500/30 text-red-400 hover:bg-red-900/30"
          onClick={() => navigate("/admin")}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState message="Loading deleted content..." />;
  }

  return (
    <div className="space-y-4">
      {/* Ghost mode banner */}
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Ghost className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-200 font-medium">Ghost Mode - Viewing Deleted Content</span>
        </div>
        <Badge className="bg-red-800 text-white">Admin Only</Badge>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search deleted content..."
            className="pl-10 bg-[#0D1117]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-[130px] bg-[#0D1117]/50">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="posts">Posts</SelectItem>
              <SelectItem value="dating_ads">Dating Ads</SelectItem>
              <SelectItem value="direct_messages">Messages</SelectItem>
              <SelectItem value="stories">Stories</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[130px] bg-[#0D1117]/50">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24 Hours</SelectItem>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0D1117]">
            <TableRow>
              <TableHead className="w-[180px]">User</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[120px]">Deleted Date</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((content: any) => (
              <TableRow key={`${content.content_type}-${content.id}`} className="border-white/5 hover:bg-[#0D1117]/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    {content.profiles?.avatar_url || content.sender?.avatar_url ? (
                      <img
                        src={content.profiles?.avatar_url || content.sender?.avatar_url}
                        alt="User"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 p-1 rounded-full bg-gray-700 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium text-sm">
                        {content.profiles?.username || content.sender?.username || "Unknown User"}
                      </div>
                      {content.content_type === "message" && (
                        <div className="text-xs text-muted-foreground">
                          To: {content.recipient?.username || "Unknown"}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm truncate max-w-[300px]">
                    {content.content_type === "post" && content.content}
                    {content.content_type === "dating_ad" && content.title}
                    {content.content_type === "message" && content.content}
                    {content.content_type === "story" && (
                      <span className="flex items-center gap-1">
                        <LayoutList className="h-3 w-3" />
                        {content.media_url ? "Image Story" : "Video Story"}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {content.content_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">
                      {format(new Date(content.deleted_at || content.updated_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleViewContent(content)}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Content
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedContent(content);
                          setRestoreDialog(true);
                        }}
                        className="cursor-pointer text-green-500"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restore Content
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedContent(content);
                          setPermanentDeleteDialog(true);
                        }}
                        className="cursor-pointer text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Permanently Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {(!data || data.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  No deleted content found for the selected time period
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View content dialog */}
      <Dialog open={viewContentDialog} onOpenChange={setViewContentDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Deleted Content</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="capitalize">
                  {selectedContent.content_type}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Deleted {format(new Date(selectedContent.deleted_at || selectedContent.updated_at), "PPpp")}
                </div>
              </div>
              
              <div className="bg-[#0D1117] p-4 rounded-md border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  {selectedContent.profiles?.avatar_url || selectedContent.sender?.avatar_url ? (
                    <img
                      src={selectedContent.profiles?.avatar_url || selectedContent.sender?.avatar_url}
                      alt="User"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 p-2 rounded-full bg-gray-700 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium">
                      {selectedContent.profiles?.username || selectedContent.sender?.username || "Unknown User"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {format(new Date(selectedContent.created_at), "PPp")}
                    </div>
                  </div>
                </div>
                
                {selectedContent.content_type === "post" && (
                  <div className="space-y-3">
                    <p className="whitespace-pre-line">{selectedContent.content}</p>
                    {selectedContent.media_url && selectedContent.media_url.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {selectedContent.media_url.map((url: string, index: number) => (
                          <img 
                            key={index} 
                            src={url} 
                            alt={`Media ${index}`} 
                            className="w-full h-48 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                    {selectedContent.video_urls && selectedContent.video_urls.length > 0 && (
                      <div className="mt-4">
                        <video 
                          controls 
                          className="w-full rounded"
                          src={selectedContent.video_urls[0]}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {selectedContent.content_type === "dating_ad" && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">{selectedContent.title}</h3>
                    <p className="whitespace-pre-line">{selectedContent.description}</p>
                    {selectedContent.about_me && (
                      <div className="mt-3 p-3 bg-black/30 rounded">
                        <h4 className="text-sm font-medium mb-1">About Me</h4>
                        <p className="text-sm whitespace-pre-line">{selectedContent.about_me}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedContent.content_type === "message" && (
                  <div className="space-y-3">
                    <div className="mb-3 text-sm">
                      <span className="text-muted-foreground">To: </span>
                      <span className="font-medium">{selectedContent.recipient?.username || "Unknown Recipient"}</span>
                    </div>
                    <p className="whitespace-pre-line">{selectedContent.content}</p>
                    {selectedContent.media_url && selectedContent.media_url.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {selectedContent.media_url.map((url: string, index: number) => (
                          <img 
                            key={index} 
                            src={url} 
                            alt={`Media ${index}`} 
                            className="w-full h-48 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {selectedContent.content_type === "story" && (
                  <div className="space-y-3">
                    {selectedContent.media_url ? (
                      <img 
                        src={selectedContent.media_url} 
                        alt="Story Image" 
                        className="w-full max-h-[400px] object-contain rounded"
                      />
                    ) : selectedContent.video_url ? (
                      <video 
                        controls 
                        src={selectedContent.video_url} 
                        className="w-full rounded"
                      />
                    ) : (
                      <p className="text-muted-foreground italic">No media available</p>
                    )}
                    <div className="text-sm">
                      <div>Created: {format(new Date(selectedContent.created_at), "PPp")}</div>
                      <div>Expired: {format(new Date(selectedContent.expires_at), "PPp")}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewContentDialog(false);
                    setRestoreDialog(true);
                  }}
                  className="bg-green-700/20 hover:bg-green-700/40 border-green-700/40 text-green-500"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore Content
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewContentDialog(false);
                    setPermanentDeleteDialog(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Permanently Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Restore confirmation dialog */}
      <AlertDialog open={restoreDialog} onOpenChange={setRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this deleted content? It will become visible to users again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRestoreContent}
              className="bg-green-600 hover:bg-green-700"
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent delete confirmation dialog */}
      <AlertDialog open={permanentDeleteDialog} onOpenChange={setPermanentDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this content? This action cannot be undone and the data will be irrecoverably lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePermanentDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Permanently Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
