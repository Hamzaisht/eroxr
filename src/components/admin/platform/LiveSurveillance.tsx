import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, LiveAlert } from "./user-analytics/types";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { format } from "date-fns";
import { 
  Ghost, Eye, AlertTriangle, Video, MessageSquare, Phone, 
  UserCheck, ShieldAlert, RefreshCw, Webcam, Clock, Info, 
  Play, Pause, X, Flag, Download, User
} from "lucide-react";

export const LiveSurveillance = () => {
  const [activeTab, setActiveTab] = useState('streams');
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const session = useSession();
  const { toast } = useToast();
  const { isSuperAdmin } = useSuperAdminCheck();
  const { 
    isGhostMode, 
    activeSurveillance, 
    startSurveillance, 
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  } = useGhostMode();
  
  useEffect(() => {
    if (!isGhostMode || !isSuperAdmin) {
      // Only accessible in ghost mode
      return;
    }
    
    fetchLiveSessions();
    
    // Poll for live sessions every 30 seconds
    const interval = setInterval(fetchLiveSessions, 30000);
    
    return () => clearInterval(interval);
  }, [isGhostMode, isSuperAdmin, activeTab]);
  
  const fetchLiveSessions = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Fetch different types of sessions based on active tab
      let data: LiveSession[] = [];
      
      switch (activeTab) {
        case 'streams':
          const { data: streams, error: streamsError } = await supabase
            .from('live_streams')
            .select(`
              id,
              creator_id,
              title,
              status,
              started_at,
              profiles:creator_id(username, avatar_url)
            `)
            .eq('status', 'live')
            .order('started_at', { ascending: false });
            
          if (streamsError) throw streamsError;
          
          data = streams.map(stream => ({
            id: stream.id,
            type: 'stream',
            user_id: stream.creator_id,
            username: stream.profiles?.username || 'Unknown',
            avatar_url: stream.profiles?.avatar_url,
            started_at: stream.started_at,
            status: 'active',
            title: stream.title,
            content_type: 'video'
          }));
          break;
          
        case 'calls':
          // In a real implementation, we would query active calls
          // This is a simplified example
          const { data: calls, error: callsError } = await supabase
            .rpc('get_active_calls');
            
          if (callsError) {
            console.error("Error fetching calls:", callsError);
            data = [];
          } else {
            data = (calls || []).map((call: any) => ({
              id: call.id,
              type: 'call',
              user_id: call.initiator_id,
              username: call.username,
              avatar_url: call.avatar_url,
              started_at: call.started_at,
              participants: call.participant_count,
              status: 'active',
              content_type: call.call_type
            }));
          }
          break;
          
        case 'chats':
          const { data: chats, error: chatsError } = await supabase
            .from('direct_messages')
            .select(`
              id,
              sender_id,
              recipient_id,
              created_at,
              message_type,
              sender:sender_id(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(20); // Get recent messages
            
          if (chatsError) throw chatsError;
          
          // Group chats by sender_id and recipient_id pairs
          const uniqueChats = new Map();
          chats.forEach(chat => {
            const chatKey = `${chat.sender_id}:${chat.recipient_id}`;
            if (!uniqueChats.has(chatKey)) {
              uniqueChats.set(chatKey, {
                id: chatKey,
                type: 'chat',
                user_id: chat.sender_id,
                username: chat.sender?.username || 'Unknown',
                avatar_url: chat.sender?.avatar_url,
                started_at: chat.created_at,
                status: 'active',
                content_type: chat.message_type
              });
            }
          });
          
          data = Array.from(uniqueChats.values());
          break;
          
        case 'bodycontact':
          const { data: ads, error: adsError } = await supabase
            .from('dating_ads')
            .select(`
              id,
              user_id,
              title,
              moderation_status,
              created_at,
              profiles:user_id(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(20);
            
          if (adsError) throw adsError;
          
          data = ads.map(ad => ({
            id: ad.id,
            type: 'bodycontact',
            user_id: ad.user_id,
            username: ad.profiles?.username || 'Unknown',
            avatar_url: ad.profiles?.avatar_url,
            started_at: ad.created_at,
            status: ad.moderation_status === 'pending' ? 'active' : 'flagged',
            title: ad.title,
            content_type: 'ad'
          }));
          break;
          
        default:
          break;
      }
      
      setLiveSessions(data);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      toast({
        title: "Error",
        description: `Could not load live ${activeTab}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLiveSessions();
    await refreshAlerts();
    setIsRefreshing(false);
    
    toast({
      title: "Refreshed",
      description: "Live data has been updated",
    });
  };
  
  const handleStartSurveillance = async (session: LiveSession) => {
    await startSurveillance(session);
    
    // In a real implementation, we would navigate to the appropriate page
    // based on the session type
    switch (session.type) {
      case 'stream':
        // navigate to stream viewer
        window.open(`/livestream/${session.id}`, '_blank');
        break;
      case 'call':
        // navigate to call viewer
        break;
      case 'chat':
        // navigate to chat
        window.open(`/messages?userId=${session.user_id}`, '_blank');
        break;
      case 'bodycontact':
        // navigate to ad
        window.open(`/dating/ad/${session.id}`, '_blank');
        break;
      default:
        break;
    }
  };
  
  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'stream':
        return <Webcam className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'bodycontact':
        return <User className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'flag':
        return <Flag className="h-4 w-4 text-orange-400" />;
      case 'report':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'risk':
        return <ShieldAlert className="h-4 w-4 text-yellow-400" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'stream':
        return 'Livestream';
      case 'call':
        return 'Call';
      case 'message':
        return 'Message';
      case 'post':
        return 'Post';
      case 'ad':
        return 'Ad';
      default:
        return type;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-yellow-500">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  if (!isGhostMode || !isSuperAdmin) {
    return (
      <div className="p-8 text-center">
        <Ghost className="h-12 w-12 mx-auto mb-4 text-purple-400" />
        <h2 className="text-2xl font-bold mb-2">Ghost Mode Required</h2>
        <p className="text-gray-400 mb-4">
          You must be in Ghost Mode to access the surveillance dashboard.
        </p>
        <Button
          onClick={() => toast({
            title: "Ghost Mode Required",
            description: "Enable Ghost Mode in the admin sidebar to continue."
          })}
          className="bg-purple-900 hover:bg-purple-800"
        >
          <Ghost className="h-4 w-4 mr-2" />
          Enable Ghost Mode
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Live Surveillance</h1>
          <p className="text-gray-400">Monitor real-time platform activity</p>
        </div>
        
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="streams" className="flex items-center gap-2">
            <Webcam className="h-4 w-4" />
            <span className="hidden md:inline">Live Streams</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden md:inline">Active Calls</span>
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Live Chats</span>
          </TabsTrigger>
          <TabsTrigger value="bodycontact" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">BodyContact</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden md:inline">Live Alerts</span>
            {liveAlerts.length > 0 && (
              <Badge className="ml-2 bg-red-600">{liveAlerts.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TabsContent value="streams" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webcam className="h-5 w-5" />
                  Live Streams
                </CardTitle>
                <CardDescription>
                  Active streams happening right now
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                    </div>
                  ) : liveSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Webcam className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No active streams at the moment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {liveSessions.map((streamSession) => (
                        <div 
                          key={streamSession.id} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
                        >
                          <Avatar>
                            <AvatarImage src={streamSession.avatar_url || undefined} />
                            <AvatarFallback>{streamSession.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{streamSession.username}</h3>
                              <Badge 
                                variant="outline" 
                                className="font-normal text-xs bg-green-900/30 text-green-300 border-green-800"
                              >
                                Live
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-400 truncate">
                              {streamSession.title || 'Untitled stream'}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Started {format(new Date(streamSession.started_at), 'HH:mm:ss')}</span>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800/50"
                            onClick={() => handleStartSurveillance(streamSession)}
                          >
                            <Ghost className="h-4 w-4 mr-2" />
                            Monitor
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calls" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Active Calls
                </CardTitle>
                <CardDescription>
                  Voice and video calls in progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                    </div>
                  ) : liveSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Phone className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No active calls at the moment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {liveSessions.map((callSession) => (
                        <div 
                          key={callSession.id} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
                        >
                          <Avatar>
                            <AvatarImage src={callSession.avatar_url || undefined} />
                            <AvatarFallback>{callSession.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{callSession.username}</h3>
                              <Badge 
                                variant="outline" 
                                className="font-normal text-xs bg-green-900/30 text-green-300 border-green-800"
                              >
                                In Call
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-400">
                              {callSession.participants || 2} participants • {callSession.content_type === 'video' ? 'Video' : 'Voice'} call
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Started {format(new Date(callSession.started_at), 'HH:mm:ss')}</span>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800/50"
                            onClick={() => handleStartSurveillance(callSession)}
                          >
                            <Ghost className="h-4 w-4 mr-2" />
                            Monitor
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chats" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Chats
                </CardTitle>
                <CardDescription>
                  Active conversations between users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                    </div>
                  ) : liveSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No active chats at the moment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {liveSessions.map((chatSession) => (
                        <div 
                          key={chatSession.id} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
                        >
                          <Avatar>
                            <AvatarImage src={chatSession.avatar_url || undefined} />
                            <AvatarFallback>{chatSession.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{chatSession.username}</h3>
                              <Badge 
                                variant="outline" 
                                className="font-normal text-xs bg-blue-900/30 text-blue-300 border-blue-800"
                              >
                                {chatSession.content_type === 'snap' ? 'Snap' : 'Message'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Active {format(new Date(chatSession.started_at), 'HH:mm:ss')}</span>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800/50"
                            onClick={() => handleStartSurveillance(chatSession)}
                          >
                            <Ghost className="h-4 w-4 mr-2" />
                            Monitor
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bodycontact" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  BodyContact Ads
                </CardTitle>
                <CardDescription>
                  Recent and pending bodycontact ads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                    </div>
                  ) : liveSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <User className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No recent bodycontact ads</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {liveSessions.map((adSession) => (
                        <div 
                          key={adSession.id} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
                        >
                          <Avatar>
                            <AvatarImage src={adSession.avatar_url || undefined} />
                            <AvatarFallback>{adSession.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{adSession.username}</h3>
                              <Badge 
                                variant="outline" 
                                className={adSession.status === 'active' 
                                  ? "font-normal text-xs bg-orange-900/30 text-orange-300 border-orange-800"
                                  : "font-normal text-xs bg-red-900/30 text-red-300 border-red-800"
                                }
                              >
                                {adSession.status === 'active' ? 'Pending' : 'Flagged'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-400 truncate">
                              {adSession.title || 'Untitled ad'}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Created {format(new Date(adSession.started_at), 'HH:mm:ss')}</span>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800/50"
                            onClick={() => handleStartSurveillance(adSession)}
                          >
                            <Ghost className="h-4 w-4 mr-2" />
                            Monitor
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Live Alerts
                </CardTitle>
                <CardDescription>
                  Recent flags, reports, and risk events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                    </div>
                  ) : liveAlerts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No alerts in the last 15 minutes</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {liveAlerts.map((alert) => (
                        <div 
                          key={alert.id} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
                        >
                          <Avatar>
                            <AvatarImage src={alert.avatar_url || undefined} />
                            <AvatarFallback>{alert.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{alert.username}</h3>
                              <div className="flex items-center gap-1">
                                {getAlertIcon(alert.type)}
                                <span className="text-xs text-gray-400">
                                  {alert.type === 'flag' ? 'Flagged' : 
                                   alert.type === 'report' ? 'Reported' : 'Risk Alert'}
                                </span>
                              </div>
                              {getSeverityBadge(alert.severity)}
                            </div>
                            
                            <p className="text-sm text-gray-400">
                              {getContentTypeLabel(alert.content_type)} • {alert.reason}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(alert.created_at), 'HH:mm:ss')}</span>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="bg-red-900/20 hover:bg-red-800/30 text-red-300 border-red-800/50"
                          >
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      {activeSurveillance.isWatching && activeSurveillance.session && (
        <Card className="mt-4 border border-red-500/20 bg-red-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-red-300">
              <Ghost className="h-5 w-5 text-red-400" />
              Active Surveillance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeSurveillance.session.avatar_url || undefined} />
                  <AvatarFallback>{activeSurveillance.session.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{activeSurveillance.session.username}</h3>
                    <Badge variant="outline" className="font-normal text-xs bg-red-900/30 text-red-300 border-red-800">
                      Monitoring
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    {activeSurveillance.session.type === 'stream' ? 'Livestream' : 
                     activeSurveillance.session.type === 'call' ? 'Call' : 
                     activeSurveillance.session.type === 'chat' ? 'Chat' : 'BodyContact Ad'}
                    {activeSurveillance.session.title && ` • ${activeSurveillance.session.title}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="bg-transparent hover:bg-red-900/20 text-red-300 border border-red-800"
                  onClick={() => stopSurveillance()}
                >
                  <X className="h-4 w-4 mr-2" />
                  End Surveillance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
