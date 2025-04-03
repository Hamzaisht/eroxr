import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle, AlertCircle, Ban, Flag, FileText, Video, User, Lightbulb, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useModerationActions } from "@/components/admin/platform/surveillance/hooks/moderation/useModerationActions";
import { ModerationAction, SurveillanceContentItem } from "@/components/admin/platform/surveillance/types";

export const AdminFlaggedContentView = () => {
  const [flaggedContent, setFlaggedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const supabase = useSupabaseClient();
  const { actionInProgress, handleModeration } = useModerationActions();
  
  useEffect(() => {
    const fetchFlaggedContent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('flagged_content')
          .select(`
            *,
            flagged_by_user:flagged_by(username, avatar_url),
            reporter:user_id(username, avatar_url)
          `)
          .order('flagged_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const enrichedData = await Promise.all(data.map(async (item) => {
            let contentDetails = null;
            
            if (item.content_type === 'post') {
              const { data: postData } = await supabase
                .from('posts')
                .select('*, creator:creator_id(username, avatar_url)')
                .eq('id', item.content_id)
                .single();
              contentDetails = postData;
            } else if (item.content_type === 'chat' || item.content_type === 'message') {
              const { data: messageData } = await supabase
                .from('direct_messages')
                .select('*, sender:sender_id(username, avatar_url), recipient:recipient_id(username, avatar_url)')
                .eq('id', item.content_id)
                .single();
              contentDetails = messageData;
            } else if (item.content_type === 'video') {
              const { data: videoData } = await supabase
                .from('videos')
                .select('*, creator:creator_id(username, avatar_url)')
                .eq('id', item.content_id)
                .single();
              contentDetails = videoData;
            }
            
            return {
              ...item,
              contentDetails
            };
          }));
          
          setFlaggedContent(enrichedData);
          console.log("Flagged content loaded:", enrichedData.length);
        } else {
          setFlaggedContent([]);
        }
      } catch (error) {
        console.error("Error fetching flagged content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFlaggedContent();
    
    const channel = supabase
      .channel('flagged-content-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'flagged_content',
      }, () => {
        fetchFlaggedContent();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  
  const getIconForContentType = (type: string) => {
    switch (type) {
      case 'post': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'profile': return <User className="h-4 w-4" />;
      case 'chat': case 'message': return <MessageSquare className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High Severity</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600">Medium Severity</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Low Severity</Badge>;
      default:
        return <Badge>Unknown Severity</Badge>;
    }
  };
  
  const handleAction = (item: any, action: ModerationAction) => {
    const contentItem: SurveillanceContentItem = {
      id: item.content_id,
      content_type: item.content_type,
      created_at: item.flagged_at,
      user_id: item.contentDetails?.creator_id || item.contentDetails?.sender_id,
      creator_id: item.contentDetails?.creator_id || item.contentDetails?.sender_id,
      username: item.contentDetails?.creator?.username || item.contentDetails?.sender?.username,
      avatar_url: item.contentDetails?.creator?.avatar_url || item.contentDetails?.sender?.avatar_url,
      content: item.contentDetails?.content,
      title: item.contentDetails?.title,
      media_url: item.contentDetails?.media_url
    };
    
    handleModeration(contentItem, action);
  };
  
  const filteredContent = activeTab === 'all' 
    ? flaggedContent 
    : flaggedContent.filter(item => item.content_type === activeTab);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Flagged Content</h2>
        <Badge className="bg-red-500">
          {flaggedContent.length} {flaggedContent.length === 1 ? 'Item' : 'Items'}
        </Badge>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="post">Posts</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="profile">Profiles</TabsTrigger>
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
                <Lightbulb className="h-12 w-12 text-yellow-500 mb-4 opacity-50" />
                <p className="text-gray-400">No flagged content found. This is good news!</p>
                <p className="text-xs text-gray-500 mt-2">Flagged content will appear here when users report inappropriate content.</p>
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
                      {getSeverityBadge(item.severity)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(item.flagged_at), 'MMM d, yyyy HH:mm:ss')}
                    </div>
                  </div>
                  <CardDescription>
                    Reason: {item.reason}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  {item.contentDetails ? (
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage 
                          src={item.contentDetails.creator?.avatar_url || item.contentDetails.sender?.avatar_url} 
                          alt={item.contentDetails.creator?.username || item.contentDetails.sender?.username || 'User'} 
                        />
                        <AvatarFallback>
                          {(item.contentDetails.creator?.username?.[0] || 
                            item.contentDetails.sender?.username?.[0] || 'U').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.contentDetails.creator?.username || 
                           item.contentDetails.sender?.username || 'Unknown User'}
                        </p>
                        {item.contentDetails.content && (
                          <div className="mt-2 p-3 bg-slate-900/50 rounded-md text-sm">
                            {item.contentDetails.content}
                          </div>
                        )}
                        {item.contentDetails.media_url && item.contentDetails.media_url.length > 0 && (
                          <div className="mt-2 flex gap-2 overflow-x-auto">
                            {item.contentDetails.media_url.slice(0, 3).map((url: string, idx: number) => (
                              <img key={idx} src={url} alt="Content" className="h-16 w-16 object-cover rounded-md" />
                            ))}
                            {item.contentDetails.media_url.length > 3 && (
                              <div className="h-16 w-16 flex items-center justify-center bg-slate-800 rounded-md">
                                <span className="text-xs">+{item.contentDetails.media_url.length - 3}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-md">
                      <p className="text-yellow-300 text-sm">Content details unavailable or content may have been deleted.</p>
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs">
                    <p className="text-gray-400">
                      Reported by: {item.reporter?.username || item.flagged_by_user?.username || 'System'}
                    </p>
                    <p className="text-gray-400">
                      Status: <span className="capitalize">{item.status}</span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-400 border-green-800"
                      onClick={() => handleAction(item, 'restore')}
                      disabled={actionInProgress === item.content_id}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-400 border-red-800"
                      onClick={() => handleAction(item, 'delete')}
                      disabled={actionInProgress === item.content_id}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-yellow-400 border-yellow-800"
                      onClick={() => handleAction(item, 'warn')}
                      disabled={actionInProgress === item.content_id}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Warn User
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction(item, 'ban')}
                      disabled={actionInProgress === item.content_id}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Ban User
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
