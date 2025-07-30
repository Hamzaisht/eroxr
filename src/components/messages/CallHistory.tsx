import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Phone, PhoneCall, PhoneIncoming, PhoneMissed, Video, Clock, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface CallRecord {
  id: string;
  caller_id: string;
  recipient_id: string;
  call_type: 'audio' | 'video';
  status: 'completed' | 'missed' | 'declined' | 'failed';
  duration?: number;
  started_at: string;
  ended_at?: string;
  caller_profile?: {
    username: string;
    avatar_url: string;
  };
  recipient_profile?: {
    username: string;
    avatar_url: string;
  };
}

interface CallHistoryProps {
  onCallUser?: (userId: string, type: 'audio' | 'video') => void;
  onMessageUser?: (userId: string) => void;
}

export const CallHistory = ({ onCallUser, onMessageUser }: CallHistoryProps) => {
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchCallHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('call_history')
          .select(`
            *,
            caller_profile:profiles!call_history_caller_id_fkey(username, avatar_url),
            recipient_profile:profiles!call_history_recipient_id_fkey(username, avatar_url)
          `)
          .or(`caller_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('started_at', { ascending: false })
          .limit(50);

        if (error) {
          console.log('No call history available yet');
          setCallHistory([]);
        } else {
          setCallHistory(data || []);
        }
      } catch (error) {
        console.log('Call history will be available once you make your first call');
        setCallHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallHistory();

    // Subscribe to real-time call updates
    const channel = supabase
      .channel(`call-history-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'call_history',
        filter: `or(caller_id.eq.${user.id},recipient_id.eq.${user.id})`
      }, (payload) => {
        fetchCallHistory(); // Refresh the list
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getCallIcon = (call: CallRecord) => {
    const isIncoming = call.recipient_id === user?.id;
    const isMissed = call.status === 'missed';
    const isVideo = call.call_type === 'video';

    if (isMissed && isIncoming) {
      return <PhoneMissed className="h-4 w-4 text-red-400" />;
    } else if (isIncoming) {
      return <PhoneIncoming className="h-4 w-4 text-green-400" />;
    } else if (isVideo) {
      return <Video className="h-4 w-4 text-blue-400" />;
    } else {
      return <PhoneCall className="h-4 w-4 text-white/70" />;
    }
  };

  const getOtherUser = (call: CallRecord) => {
    const isIncoming = call.recipient_id === user?.id;
    return isIncoming ? call.caller_profile : call.recipient_profile;
  };

  const getOtherUserId = (call: CallRecord) => {
    return call.recipient_id === user?.id ? call.caller_id : call.recipient_id;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 bg-white/10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (callHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 px-4 h-full min-h-[300px]">
        <div className="bg-white/5 rounded-full p-6 mb-6">
          <Phone className="h-12 w-12 text-white/40 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Call History</h3>
        <p className="text-white/60 text-sm max-w-[200px] leading-relaxed">
          Your recent calls will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {callHistory.map((call, index) => {
        const otherUser = getOtherUser(call);
        const otherUserId = getOtherUserId(call);
        
        return (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="relative">
              <Avatar className="h-12 w-12 border border-white/10">
                <AvatarImage src={otherUser?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-purple-500/30 text-white">
                  {otherUser?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                {getCallIcon(call)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium truncate">
                  {otherUser?.username || 'Unknown User'}
                </h4>
                <span className="text-xs text-white/50">
                  {formatTime(call.started_at)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span className="capitalize">{call.call_type}</span>
                {call.status === 'completed' && call.duration && (
                  <>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(call.duration)}</span>
                  </>
                )}
                {call.status === 'missed' && (
                  <>
                    <span>•</span>
                    <span className="text-red-400">Missed</span>
                  </>
                )}
                {call.status === 'declined' && (
                  <>
                    <span>•</span>
                    <span className="text-orange-400">Declined</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => onCallUser?.(otherUserId, 'audio')}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => onCallUser?.(otherUserId, 'video')}
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => onMessageUser?.(otherUserId)}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};