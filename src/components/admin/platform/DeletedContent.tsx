import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle, Trash2, Eye, RefreshCw, FileText, Video, MessageSquare, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useModerationActions } from "@/components/admin/platform/surveillance/hooks/moderation/useModerationActions";
import { ModerationAction, SurveillanceContentItem } from "@/components/admin/platform/surveillance/types";

export const DeletedContent = () => {
  const [deletedContent, setDeletedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const supabase = useSupabaseClient();
  const { actionInProgress, handleModeration } = useModerationActions();
  
  useEffect(() => {
    const fetchDeletedContent = async () => {
      setIsLoading(true);
      try {
        // Fetch deleted posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*, creator:creator_id(username, avatar_url)')
          .eq('visibility', 'deleted')
          .order('updated_at', { ascending: false });
        
        if (postsError) throw postsError;
        
        // Fetch deleted messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('direct_messages')
          .select('*, sender:sender_id(username, avatar_url), recipient:recipient_id(username, avatar_url)')
          .filter('content', 'ilike', '%[Content removed by moderator]%')
          .order('updated_at', { ascending: false });
        
        if (messagesError) throw messagesError;
        
        // Fetch deleted videos
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('*, creator:creator_id(username, avatar_url)')
          .eq('visibility', 'deleted')
          .order('updated_at', { ascending: false });
        
        if (videosError) throw videosError;
        
        // Transform post data
        const transformedPosts = (postsData || []).map(post => ({
          id: post.id,
          content_id: post.id,
          content_type: 'post',
          user_id: post.creator_id,
          username: post.creator?.username,
          avatar_url: post.creator?.avatar_url,
          content: post.content,
          created_at: post.created_at,
          updated_at: post.updated_at,
          media_url: post.media_url,
          contentDetails: post
        }));
        
        // Transform message data
        const transformedMessages = (messagesData || []).map(message => ({
          id: message.id,
          content_id: message.id,
          content_type: 'message',
          user_id: message.sender_id,
          username: message.sender?.username,
          avatar_url: message.sender?.avatar_url,
          content: message.original_content || message.content,
          created_at: message.created_at,
          updated_at: message.updated_at,
          media_url: message.media_url,
          contentDetails: message
        }));
        
        // Transform video data
        const transformedVideos = (videosData || []).map(video => ({
          id: video.id,
          content_id: video.id,
          content_type: 'video',
          user_id: video.creator_id,
          username: video.creator?.username,
          avatar_url: video.creator?.avatar_url,
          content: video.description,
          title: video.title,
          created_at: video.created_at,
          updated_at: video.updated_at,
          media_url: [video.thumbnail_url].filter(Boolean),
          contentDetails: video
        }));
        
        // Combine all content
        const allDeletedContent = [
          ...transformedPosts,
          ...transformedMessages,
          ...transformedVideos
        ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        
        setDeletedContent(allDeletedContent);
        console.log("Deleted content loaded:", allDeletedContent.length);
      } catch (error) {
        console.error("Error fetching deleted content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeletedContent();
    
    // Set up real-time subscriptions for content changes
    const postsChannel = supabase
      .channel('deleted-posts-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts',
        filter: 'visibility=eq.deleted'
      }, () => {
        fetchDeletedContent();
      })
      .subscribe();
      
    const messagesChannel = supabase
      .channel('deleted-messages-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'direct_messages',
      }, () => {
        fetchDeletedContent();
      })
      .subscribe();
      
    const videosChannel = supabase
      .channel('deleted-videos-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'videos',
        filter: 'visibility=eq.deleted'
      }, () => {
        fetchDeletedContent();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(videosChannel);
    };
  }, [supabase]);
  
  const getIconForContentType = (type: string) => {
    switch (type) {
      case 'post': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const transformToSurveillanceItem = (item: any): SurveillanceContentItem => {
    return {
      id: item.id,
      content_type: item.content_type,
      created_at: item.created_at,
      user_id: item.user_id,
      creator_id: item.creator_id || item.user_id,
      username: item.username,
      creator_username: item.username || 'Unknown',
      avatar_url: item.avatar_url,
      creator_avatar_url: item.avatar_url,
      content: item.content,
      title: item.title || '',
      description: item.description || '',
      media_url: item.media_url || [],
      visibility: item.visibility || 'deleted',
      location: item.location || '',
      tags: item.tags || [],
      views: item.views || 0,
      likes: item.likes || 0,
      comments: item.comments || 0
    };
  };
  
  const handleAction = (item: any, action: ModerationAction) => {
    // Convert to SurveillanceContentItem format for moderation
    const contentItem: SurveillanceContentItem = transformToSurveillanceItem(item);
    
    handleModeration(contentItem, action);
  };
  
  const filteredContent = activeTab === 'all' 
    ? deletedContent 
    : deletedContent.filter(item => item.content_type === activeTab);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Deleted Content</h2>
        <Badge className="bg-red-500">
          {deletedContent.length} {deletedContent.length === 1 ? 'Item' : 'Items'}
        </Badge>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="post">Posts</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-20 w-full rounded-md" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : filteredContent.length === 0 ? (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-12">
                <Lightbulb className="h-12 w-12 text-blue-500 mb-4 opacity-50" />
                <p className="text-gray-400">No deleted content found.</p>
                <p className="text-xs text-gray-500 mt-2">Content removed by moderators will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            filteredContent.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getIconForContentType(item.content_type)}
                      <CardTitle className="text-base capitalize">
                        {item.content_type} Content
                      </CardTitle>
                      <Badge variant="destructive">Deleted</Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      Deleted at: {format(new Date(item.updated_at), 'MMM d, yyyy HH:mm:ss')}
                    </div>
                  </div>
                  <CardDescription>
                    Created: {format(new Date(item.created_at), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={item.avatar_url} alt={item.username || 'User'} />
                      <AvatarFallback>
                        {(item.username?.[0] || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.username || 'Unknown User'}
                      </p>
                      {item.content && (
                        <div className="mt-2 p-3 bg-slate-900/50 rounded-md text-sm">
                          {item.content}
                        </div>
                      )}
                      {item.media_url && item.media_url.length > 0 && (
                        <div className="mt-2 flex gap-2 overflow-x-auto">
                          {item.media_url.slice(0, 3).map((url: string, idx: number) => (
                            <img key={idx} src={url} alt="Content" className="h-16 w-16 object-cover rounded-md" />
                          ))}
                          {item.media_url.length > 3 && (
                            <div className="h-16 w-16 flex items-center justify-center bg-slate-800 rounded-md">
                              <span className="text-xs">+{item.media_url.length - 3}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-400 border-green-800"
                    onClick={() => handleAction(item, 'restore')}
                    disabled={actionInProgress === item.content_id}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-400"
                      onClick={() => handleAction(item, 'view')}
                      disabled={actionInProgress === item.content_id}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction(item, 'force_delete')}
                      disabled={actionInProgress === item.content_id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Permanently
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
