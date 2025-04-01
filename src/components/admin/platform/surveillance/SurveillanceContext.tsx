
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, LiveAlert } from "../user-analytics/types";
import { supabase } from "@/integrations/supabase/client";

interface SurveillanceContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  liveSessions: LiveSession[];
  setLiveSessions: (sessions: LiveSession[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isRefreshing: boolean;
  setIsRefreshing: (refreshing: boolean) => void;
  fetchLiveSessions: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleStartSurveillance: (session: LiveSession) => Promise<void>;
}

const SurveillanceContext = createContext<SurveillanceContextType | undefined>(undefined);

export const SurveillanceProvider = ({ 
  children,
  liveAlerts,
  refreshAlerts,
  startSurveillance
}: { 
  children: ReactNode;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
  startSurveillance: (session: LiveSession) => Promise<boolean>;
}) => {
  const [activeTab, setActiveTab] = useState('streams');
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const session = useSession();
  const { toast } = useToast();
  
  const fetchLiveSessions = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    
    try {
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
          
          data = streams.map(stream => {
            const username = stream.profiles?.[0]?.username || 'Unknown';
            const avatar_url = stream.profiles?.[0]?.avatar_url || null;
            
            return {
              id: stream.id,
              type: 'stream',
              user_id: stream.creator_id,
              username: username,
              avatar_url: avatar_url,
              started_at: stream.started_at,
              status: 'active',
              title: stream.title,
              content_type: 'video',
              created_at: stream.started_at,
            };
          });
          break;
          
        case 'calls':
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
              username: call.username || 'Unknown',
              avatar_url: call.avatar_url || '',
              started_at: call.started_at,
              participants: call.participant_count,
              status: 'active',
              content_type: call.call_type,
              created_at: call.started_at,
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
            .limit(20);
            
          if (chatsError) throw chatsError;
          
          const uniqueChats = new Map();
          chats.forEach(chat => {
            const chatKey = `${chat.sender_id}:${chat.recipient_id}`;
            if (!uniqueChats.has(chatKey)) {
              const username = chat.sender?.[0]?.username || 'Unknown';
              const avatar_url = chat.sender?.[0]?.avatar_url || '';
              
              uniqueChats.set(chatKey, {
                id: chatKey,
                type: 'chat',
                user_id: chat.sender_id,
                username: username,
                avatar_url: avatar_url,
                started_at: chat.created_at,
                status: 'active',
                content_type: chat.message_type,
                created_at: chat.created_at,
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
          
          data = ads.map(ad => {
            const username = ad.profiles?.[0]?.username || 'Unknown';
            const avatar_url = ad.profiles?.[0]?.avatar_url || '';
            
            return {
              id: ad.id,
              type: 'bodycontact',
              user_id: ad.user_id,
              username: username,
              avatar_url: avatar_url,
              started_at: ad.created_at,
              status: ad.moderation_status === 'pending' ? 'active' : 'flagged',
              title: ad.title,
              content_type: 'ad',
              created_at: ad.created_at
            };
          });
          break;
          
        default:
          break;
      }
      
      console.log(`Fetched ${data.length} ${activeTab} for surveillance`);
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
  }, [activeTab, session?.user?.id, toast]);
  
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
    const success = await startSurveillance(session);
    
    if (success) {
      switch (session.type) {
        case 'stream':
          window.open(`/livestream/${session.id}`, '_blank');
          break;
        case 'call':
          toast({
            title: "Call Monitoring",
            description: "This feature requires additional setup. Use the surveillance panel."
          });
          break;
        case 'chat':
          window.open(`/messages?userId=${session.user_id}`, '_blank');
          break;
        case 'bodycontact':
          window.open(`/dating/ad/${session.id}`, '_blank');
          break;
        default:
          break;
      }
    }
  };

  return (
    <SurveillanceContext.Provider value={{
      activeTab,
      setActiveTab,
      liveSessions,
      setLiveSessions,
      isLoading,
      setIsLoading,
      isRefreshing,
      setIsRefreshing,
      fetchLiveSessions,
      handleRefresh,
      handleStartSurveillance
    }}>
      {children}
    </SurveillanceContext.Provider>
  );
};

export const useSurveillance = () => {
  const context = useContext(SurveillanceContext);
  if (context === undefined) {
    throw new Error('useSurveillance must be used within a SurveillanceProvider');
  }
  return context;
};
