
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Eye, 
  RotateCcw, 
  Trash2, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  MessageSquare,
  Image,
  Video,
  Heart
} from "lucide-react";
import { format } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DateRangePicker, 
  DateRange 
} from "@/components/ui/date-range-picker";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/LoadingState";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DeletedContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [contentType, setContentType] = useState<"users" | "posts" | "messages" | "dating_ads" | "videos">("users");
  const pageSize = 10;
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch deleted users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["deleted-users", currentPage, dateRange, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('is_suspended', true);

      // Apply search filter
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      // Apply date range filter
      if (dateRange.from) {
        query = query.gte('suspended_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        // Add one day to include items from the last day
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('suspended_at', endDate.toISOString());
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query
        .range(from, from + pageSize - 1)
        .order('suspended_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { items: data, totalCount: count || 0 };
    },
    enabled: contentType === "users"
  });

  // Fetch deleted posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["deleted-posts", currentPage, dateRange, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles(username, avatar_url)
        `, { count: 'exact' })
        .eq('visibility', 'deleted');

      // Apply search filter
      if (searchTerm) {
        query = query.or(`content.ilike.%${searchTerm}%,profiles.username.ilike.%${searchTerm}%`);
      }

      // Apply date range filter
      if (dateRange.from) {
        query = query.gte('updated_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('updated_at', endDate.toISOString());
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query
        .range(from, from + pageSize - 1)
        .order('updated_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { items: data, totalCount: count || 0 };
    },
    enabled: contentType === "posts"
  });

  // Fetch deleted messages
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["deleted-messages", currentPage, dateRange, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('direct_messages')
        .select(`
          *,
          sender:profiles!direct_messages_sender_id_fkey(username, avatar_url),
          recipient:profiles!direct_messages_recipient_id_fkey(username, avatar_url)
        `, { count: 'exact' })
        .eq('is_expired', true);

      // Apply search filter
      if (searchTerm) {
        query = query.or(`content.ilike.%${searchTerm}%,sender.username.ilike.%${searchTerm}%,recipient.username.ilike.%${searchTerm}%`);
      }

      // Apply date range filter
      if (dateRange.from) {
        query = query.gte('expires_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('expires_at', endDate.toISOString());
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query
        .range(from, from + pageSize - 1)
        .order('expires_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { items: data, totalCount: count || 0 };
    },
    enabled: contentType === "messages"
  });

  // Fetch deleted dating ads
  const { data: datingAdsData, isLoading: datingAdsLoading } = useQuery({
    queryKey: ["deleted-dating-ads", currentPage, dateRange, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('dating_ads')
        .select(`
          *,
          profiles:profiles!dating_ads_user_id_fkey(username, avatar_url)
        `, { count: 'exact' })
        .eq('is_active', false);

      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,profiles.username.ilike.%${searchTerm}%`);
      }

      // Apply date range filter
      if (dateRange.from) {
        query = query.gte('updated_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('updated_at', endDate.toISOString());
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query
        .range(from, from + pageSize - 1)
        .order('updated_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { items: data, totalCount: count || 0 };
    },
    enabled: contentType === "dating_ads"
  });

  // Fetch deleted videos
  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ["deleted-videos", currentPage, dateRange, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('videos')
        .select(`
          *,
          profiles:profiles!videos_creator_id_fkey(username, avatar_url)
        `, { count: 'exact' })
        .eq('visibility', 'deleted');

      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,profiles.username.ilike.%${searchTerm}%`);
      }

      // Apply date range filter
      if (dateRange.from) {
        query = query.gte('updated_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('updated_at', endDate.toISOString());
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query
        .range(from, from + pageSize - 1)
        .order('updated_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { items: data, totalCount: count || 0 };
    },
    enabled: contentType === "videos"
  });

  // Handle restoration of deleted content
  const handleRestore = useMutation({
    mutationFn: async ({ 
      id, 
      type 
    }: { 
      id: string; 
      type: "users" | "posts" | "messages" | "dating_ads" | "videos"
    }) => {
      let error;
      
      switch (type) {
        case "users":
          ({ error } = await supabase
            .from('profiles')
            .update({
              is_suspended: false,
              suspended_at: null
            })
            .eq('id', id));
          break;
        case "posts":
          ({ error } = await supabase
            .from('posts')
            .update({ visibility: 'public' })
            .eq('id', id));
          break;
        case "messages":
          ({ error } = await supabase
            .from('direct_messages')
            .update({ 
              is_expired: false,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Set to expire in 24 hours
            })
            .eq('id', id));
          break;
        case "dating_ads":
          ({ error } = await supabase
            .from('dating_ads')
            .update({ is_active: true })
            .eq('id', id));
          break;
        case "videos":
          ({ error } = await supabase
            .from('videos')
            .update({ visibility: 'public' })
            .eq('id', id));
          break;
      }
      
      if (error) throw error;
      
      // Log admin action
      await supabase.from('admin_audit_logs').insert({
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
        action: `restore_${type.slice(0, -1)}`,
        details: {
          item_id: id,
          timestamp: new Date().toISOString()
        }
      });
    },
    onSuccess: () => {
      const queryKey = `deleted-${contentType}`;
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setRestoreDialogOpen(false);
      
      toast({
        title: "Restoration Complete",
        description: `The ${contentType.slice(0, -1)} has been successfully restored`,
      });
    },
    onError: (error) => {
      console.error("Error restoring content:", error);
      toast({
        title: "Restoration Failed",
        description: "There was an error restoring the content",
        variant: "destructive",
      });
    }
  });

  // Calculate current data and loading state based on content type
  const currentData = contentType === "users" ? usersData :
                      contentType === "posts" ? postsData :
                      contentType === "messages" ? messagesData :
                      contentType === "dating_ads" ? datingAdsData :
                      videosData;
                      
  const isLoading = contentType === "users" ? usersLoading :
                    contentType === "posts" ? postsLoading :
                    contentType === "messages" ? messagesLoading :
                    contentType === "dating_ads" ? datingAdsLoading :
                    videosLoading;

  // Calculate total pages
  const totalPages = Math.ceil((currentData?.totalCount || 0) / pageSize);

  // Render content type icon
  const ContentTypeIcon = () => {
    switch (contentType) {
      case "users":
        return <User className="h-5 w-5 text-blue-400" />;
      case "posts":
        return <Image className="h-5 w-5 text-green-400" />;
      case "messages":
        return <MessageSquare className="h-5 w-5 text-amber-400" />;
      case "dating_ads":
        return <Heart className="h-5 w-5 text-pink-400" />;
      case "videos":
        return <Video className="h-5 w-5 text-purple-400" />;
    }
  };

  if (isLoading) {
    return <LoadingState message={`Loading deleted ${contentType}...`} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <Tabs value={contentType} onValueChange={(value) => setContentType(value as any)} className="w-full">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden md:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="dating_ads" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Dating Ads</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden md:inline">Videos</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          <div className="relative w-full md:w-auto md:min-w-[250px] lg:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${contentType}...`}
              className="pl-10 bg-[#0D1117]/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-auto">
            <DateRangePicker
              from={dateRange.from}
              to={dateRange.to}
              onSelect={setDateRange}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-white/10 overflow-hidden">
        {contentType === "users" && (
          <Table>
            <TableHeader className="bg-[#0D1117]">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Suspended</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No suspended users found
                  </TableCell>
                </TableRow>
              ) : (
                currentData?.items.map((user: any) => (
                  <TableRow key={user.id} className="border-white/5 hover:bg-[#0D1117]/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.username || 'User'} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{user.username || 'Unknown User'}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}` 
                              : 'No name provided'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.created_at && format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{user.suspended_at && format(new Date(user.suspended_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#0D1117]/50"
                          onClick={() => {
                            setSelectedItem(user);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 text-green-500 border-green-500/30 bg-green-500/10"
                          onClick={() => {
                            setSelectedItem(user);
                            setRestoreDialogOpen(true);
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        
        {contentType === "posts" && (
          <Table>
            <TableHeader className="bg-[#0D1117]">
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Deleted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No deleted posts found
                  </TableCell>
                </TableRow>
              ) : (
                currentData?.items.map((post: any) => (
                  <TableRow key={post.id} className="border-white/5 hover:bg-[#0D1117]/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-800 rounded overflow-hidden flex items-center justify-center">
                          {post.media_url && post.media_url.length > 0 ? (
                            <img 
                              src={post.media_url[0]} 
                              alt="Post thumbnail" 
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <Image className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm max-w-[200px] truncate">
                            {post.content || 'No content'}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{post.media_url?.length || 0} media items</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {post.profiles?.avatar_url ? (
                            <img 
                              src={post.profiles.avatar_url} 
                              alt={post.profiles.username || 'User'} 
                              className="h-7 w-7 object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm">{post.profiles?.username || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(post.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(post.updated_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#0D1117]/50"
                          onClick={() => {
                            setSelectedItem(post);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 text-green-500 border-green-500/30 bg-green-500/10"
                          onClick={() => {
                            setSelectedItem(post);
                            setRestoreDialogOpen(true);
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        
        {contentType === "messages" && (
          <Table>
            <TableHeader className="bg-[#0D1117]">
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Expired</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No expired messages found
                  </TableCell>
                </TableRow>
              ) : (
                currentData?.items.map((message: any) => (
                  <TableRow key={message.id} className="border-white/5 hover:bg-[#0D1117]/50">
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={message.content || 'No content'}>
                        {message.content || 'No content'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {message.sender?.avatar_url ? (
                            <img 
                              src={message.sender.avatar_url} 
                              alt={message.sender.username || 'Sender'} 
                              className="h-7 w-7 object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm">{message.sender?.username || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {message.recipient?.avatar_url ? (
                            <img 
                              src={message.recipient.avatar_url} 
                              alt={message.recipient.username || 'Recipient'} 
                              className="h-7 w-7 object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm">{message.recipient?.username || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(message.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(message.expires_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#0D1117]/50"
                          onClick={() => {
                            setSelectedItem(message);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 text-green-500 border-green-500/30 bg-green-500/10"
                          onClick={() => {
                            setSelectedItem(message);
                            setRestoreDialogOpen(true);
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        
        {contentType === "dating_ads" && (
          <Table>
            <TableHeader className="bg-[#0D1117]">
              <TableRow>
                <TableHead>Dating Ad</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Deactivated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No deactivated dating ads found
                  </TableCell>
                </TableRow>
              ) : (
                currentData?.items.map((ad: any) => (
                  <TableRow key={ad.id} className="border-white/5 hover:bg-[#0D1117]/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {ad.avatar_url ? (
                            <img 
                              src={ad.avatar_url} 
                              alt="Ad image" 
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <Heart className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{ad.title || 'No title'}</div>
                          <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {ad.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {ad.profiles?.avatar_url ? (
                            <img 
                              src={ad.profiles.avatar_url} 
                              alt={ad.profiles.username || 'User'} 
                              className="h-7 w-7 object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm">{ad.profiles?.username || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(ad.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(ad.updated_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#0D1117]/50"
                          onClick={() => {
                            setSelectedItem(ad);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 text-green-500 border-green-500/30 bg-green-500/10"
                          onClick={() => {
                            setSelectedItem(ad);
                            setRestoreDialogOpen(true);
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        
        {contentType === "videos" && (
          <Table>
            <TableHeader className="bg-[#0D1117]">
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Deleted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No deleted videos found
                  </TableCell>
                </TableRow>
              ) : (
                currentData?.items.map((video: any) => (
                  <TableRow key={video.id} className="border-white/5 hover:bg-[#0D1117]/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-16 bg-gray-800 rounded overflow-hidden flex items-center justify-center">
                          {video.thumbnail_url ? (
                            <img 
                              src={video.thumbnail_url} 
                              alt="Video thumbnail" 
                              className="h-10 w-16 object-cover"
                            />
                          ) : (
                            <Video className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{video.title || 'No title'}</div>
                          <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {video.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {video.profiles?.avatar_url ? (
                            <img 
                              src={video.profiles.avatar_url} 
                              alt={video.profiles.username || 'User'} 
                              className="h-7 w-7 object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm">{video.profiles?.username || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(video.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(video.updated_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#0D1117]/50"
                          onClick={() => {
                            setSelectedItem(video);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 text-green-500 border-green-500/30 bg-green-500/10"
                          onClick={() => {
                            setSelectedItem(video);
                            setRestoreDialogOpen(true);
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {currentData?.items.length ? ((currentPage - 1) * pageSize) + 1 : 0}-
          {Math.min(currentPage * pageSize, currentData?.totalCount || 0)} of {currentData?.totalCount || 0} items
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-[#0D1117]/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="bg-[#0D1117]/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Item Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ContentTypeIcon /> 
              Deleted {contentType.slice(0, -1)}
            </DialogTitle>
          </DialogHeader>
          
          {/* View dialog content depends on content type */}
          {contentType === "users" && selectedItem && (
            <div className="grid gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {selectedItem.avatar_url ? (
                    <img 
                      src={selectedItem.avatar_url} 
                      alt={selectedItem.username || 'User'} 
                      className="h-16 w-16 object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedItem.username || 'Unknown User'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.first_name && selectedItem.last_name 
                      ? `${selectedItem.first_name} ${selectedItem.last_name}` 
                      : 'No name provided'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Profile Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Created: {selectedItem.created_at && format(new Date(selectedItem.created_at), 'MMMM d, yyyy')}</p>
                    <p>Suspended: {selectedItem.suspended_at && format(new Date(selectedItem.suspended_at), 'MMMM d, yyyy')}</p>
                    <p>Location: {selectedItem.location || 'Not specified'}</p>
                    <p>Bio: {selectedItem.bio || 'No bio provided'}</p>
                  </div>
                </div>
                
                {selectedItem.interests && selectedItem.interests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.interests.map((interest: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-[#0D1117]/50">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {contentType === "posts" && selectedItem && (
            <div className="grid gap-4">
              <div className="p-4 bg-[#0D1117]/80 rounded-md border border-white/10">
                <p className="mb-4">{selectedItem.content}</p>
                
                {selectedItem.media_url && selectedItem.media_url.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedItem.media_url.map((url: string, index: number) => (
                      <img 
                        key={index}
                        src={url}
                        alt={`Post media ${index + 1}`}
                        className="rounded-md w-full h-32 object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Post Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Created: {format(new Date(selectedItem.created_at), 'MMMM d, yyyy')}</p>
                    <p>Deleted: {format(new Date(selectedItem.updated_at), 'MMMM d, yyyy')}</p>
                    <p>Likes: {selectedItem.likes_count}</p>
                    <p>Comments: {selectedItem.comments_count}</p>
                  </div>
                </div>
                
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-[#0D1117]/50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {contentType === "messages" && selectedItem && (
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {selectedItem.sender?.avatar_url ? (
                      <img 
                        src={selectedItem.sender.avatar_url} 
                        alt={selectedItem.sender.username || 'Sender'} 
                        className="h-10 w-10 object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{selectedItem.sender?.username || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">Sender</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(selectedItem.created_at), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium text-right">{selectedItem.recipient?.username || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground text-right">Recipient</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {selectedItem.recipient?.avatar_url ? (
                      <img 
                        src={selectedItem.recipient.avatar_url} 
                        alt={selectedItem.recipient.username || 'Recipient'} 
                        className="h-10 w-10 object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-[#0D1117]/80 rounded-md border border-white/10">
                <p>{selectedItem.content || 'No content'}</p>
                
                {selectedItem.media_url && selectedItem.media_url.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedItem.media_url.map((url: string, index: number) => (
                      <img 
                        key={index}
                        src={url}
                        alt={`Message media ${index + 1}`}
                        className="rounded-md w-full h-32 object-cover"
                      />
                    ))}
                  </div>
                )}
                
                {selectedItem.video_url && (
                  <div className="mt-3">
                    <video 
                      src={selectedItem.video_url}
                      controls
                      className="rounded-md w-full max-h-[300px]"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Message Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Sent: {format(new Date(selectedItem.created_at), 'MMMM d, yyyy h:mm a')}</p>
                    <p>Expired: {format(new Date(selectedItem.expires_at), 'MMMM d, yyyy h:mm a')}</p>
                    <p>Type: {selectedItem.message_type || 'Regular'}</p>
                    {selectedItem.viewed_at && (
                      <p>Viewed: {format(new Date(selectedItem.viewed_at), 'MMMM d, yyyy h:mm a')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {contentType === "dating_ads" && selectedItem && (
            <div className="grid gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {selectedItem.avatar_url ? (
                    <img 
                      src={selectedItem.avatar_url} 
                      alt="Dating ad profile"
                      className="h-16 w-16 object-cover"
                    />
                  ) : (
                    <Heart className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedItem.title || 'No Title'}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Created by:</span>
                    <div className="flex items-center space-x-1">
                      <div className="h-5 w-5 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {selectedItem.profiles?.avatar_url ? (
                          <img 
                            src={selectedItem.profiles.avatar_url} 
                            alt={selectedItem.profiles.username || 'User'} 
                            className="h-5 w-5 object-cover"
                          />
                        ) : (
                          <User className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm">{selectedItem.profiles?.username || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-[#0D1117]/80 rounded-md border border-white/10">
                <p>{selectedItem.description || 'No description'}</p>
                
                {selectedItem.video_url && (
                  <div className="mt-3">
                    <video 
                      src={selectedItem.video_url}
                      controls
                      className="rounded-md w-full max-h-[300px]"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Dating Ad Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Created: {format(new Date(selectedItem.created_at), 'MMMM d, yyyy')}</p>
                    <p>Deactivated: {format(new Date(selectedItem.updated_at), 'MMMM d, yyyy')}</p>
                    <p>City: {selectedItem.city || 'Not specified'}</p>
                    <p>Views: {selectedItem.view_count || 0}</p>
                  </div>
                </div>
                
                {selectedItem.interests && selectedItem.interests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.interests.map((interest: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-[#0D1117]/50">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Looking For</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.looking_for && selectedItem.looking_for.map((item: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-[#0D1117]/50">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Personal Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Height: {selectedItem.height ? `${selectedItem.height} cm` : 'Not specified'}</p>
                    <p>Body Type: {selectedItem.body_type || 'Not specified'}</p>
                    <p>Smoking: {selectedItem.smoking_status || 'Not specified'}</p>
                    <p>Drinking: {selectedItem.drinking_status || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {contentType === "videos" && selectedItem && (
            <div className="grid gap-4">
              <div>
                {selectedItem.thumbnail_url ? (
                  <img 
                    src={selectedItem.thumbnail_url}
                    alt="Video thumbnail"
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 rounded-md flex items-center justify-center mb-3">
                    <Video className="h-12 w-12 text-gray-600" />
                  </div>
                )}
                
                <h3 className="text-lg font-medium">{selectedItem.title || 'No Title'}</h3>
                <p className="text-sm text-muted-foreground">{selectedItem.description || 'No description'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Video Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Created: {format(new Date(selectedItem.created_at), 'MMMM d, yyyy')}</p>
                    <p>Deleted: {format(new Date(selectedItem.updated_at), 'MMMM d, yyyy')}</p>
                    <p>Duration: {selectedItem.duration ? `${Math.floor(selectedItem.duration / 60)}:${String(selectedItem.duration % 60).padStart(2, '0')}` : 'Unknown'}</p>
                    <p>Views: {selectedItem.view_count || 0}</p>
                    <p>Likes: {selectedItem.like_count || 0}</p>
                    <p>Comments: {selectedItem.comment_count || 0}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Creator</h4>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {selectedItem.profiles?.avatar_url ? (
                        <img 
                          src={selectedItem.profiles.avatar_url} 
                          alt={selectedItem.profiles.username || 'Creator'} 
                          className="h-10 w-10 object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{selectedItem.profiles?.username || 'Unknown Creator'}</div>
                    </div>
                  </div>
                  
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-[#0D1117]/50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedItem.video_url && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Video Preview</h4>
                  <video 
                    src={selectedItem.video_url}
                    controls
                    className="rounded-md w-full max-h-[300px]"
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setViewDialogOpen(false);
                setRestoreDialogOpen(true);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore {contentType.slice(0, -1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore {contentType.slice(0, -1)}</DialogTitle>
            <DialogDescription>
              This will restore the {contentType.slice(0, -1)} to its active state and make it visible again.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                <ContentTypeIcon />
              </div>
              <div>
                <div className="font-medium">
                  {contentType === "users" ? selectedItem?.username :
                   contentType === "posts" ? (selectedItem?.content?.substring(0, 30) + (selectedItem?.content?.length > 30 ? '...' : '')) :
                   contentType === "messages" ? (selectedItem?.content?.substring(0, 30) + (selectedItem?.content?.length > 30 ? '...' : '')) :
                   contentType === "dating_ads" ? selectedItem?.title :
                   contentType === "videos" ? selectedItem?.title :
                   'Item'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {contentType === "users" ? `Suspended: ${selectedItem?.suspended_at && format(new Date(selectedItem.suspended_at), 'MMM d, yyyy')}` :
                   contentType === "posts" ? `By: ${selectedItem?.profiles?.username}` :
                   contentType === "messages" ? `From: ${selectedItem?.sender?.username} To: ${selectedItem?.recipient?.username}` :
                   contentType === "dating_ads" ? `By: ${selectedItem?.profiles?.username}` :
                   contentType === "videos" ? `By: ${selectedItem?.profiles?.username}` :
                   ''}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setRestoreDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (selectedItem) {
                  handleRestore.mutate({
                    id: selectedItem.id,
                    type: contentType
                  });
                }
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Confirm Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
