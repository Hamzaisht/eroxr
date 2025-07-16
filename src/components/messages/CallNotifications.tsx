import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CallNotification {
  id: string;
  call_id: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  call?: {
    id: string;
    caller_id: string;
    call_type: string;
    status: string;
    caller?: {
      username: string;
      avatar_url?: string;
    };
  };
}

interface CallNotificationsProps {
  onIncomingCall?: (callId: string, callType: string, caller: any) => void;
}

export const CallNotifications = ({ onIncomingCall }: CallNotificationsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [notifications, setNotifications] = useState<CallNotification[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Subscribe to call notifications
    const channel = supabase
      .channel(`call_notifications:${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_notifications',
          filter: `user_id=eq.${session.user.id}`
        },
        async (payload) => {
          const notification = payload.new as CallNotification;
          
          if (notification.notification_type === 'incoming_call') {
            // Fetch call details with caller info
            const { data: callData } = await supabase
              .from('call_history')
              .select(`
                *,
                caller:profiles!call_history_caller_id_fkey(username, avatar_url)
              `)
              .eq('id', notification.call_id)
              .single();

            if (callData) {
              setIncomingCall({
                ...callData,
                notificationId: notification.id
              });
              onIncomingCall?.(callData.id, callData.call_type, callData.caller);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, onIncomingCall]);

  const acceptCall = async () => {
    if (!incomingCall) return;

    try {
      // Update call status to connected
      await supabase
        .from('call_history')
        .update({ 
          status: 'connected',
          connected_at: new Date().toISOString()
        })
        .eq('id', incomingCall.id);

      // Mark notification as read
      await supabase
        .from('call_notifications')
        .update({ is_read: true })
        .eq('id', incomingCall.notificationId);

      setIncomingCall(null);
      
      toast({
        title: "Call accepted",
        description: "Connecting to call...",
      });
    } catch (error) {
      console.error('Error accepting call:', error);
      toast({
        title: "Failed to accept call",
        variant: "destructive",
      });
    }
  };

  const rejectCall = async () => {
    if (!incomingCall) return;

    try {
      // Update call status to ended
      await supabase
        .from('call_history')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', incomingCall.id);

      // Mark notification as read
      await supabase
        .from('call_notifications')
        .update({ is_read: true })
        .eq('id', incomingCall.notificationId);

      setIncomingCall(null);
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  };

  if (!incomingCall) return null;

  return (
    <Dialog open={!!incomingCall} onOpenChange={() => rejectCall()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {incomingCall.call_type === 'video' ? 'Incoming Video Call' : 'Incoming Call'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={incomingCall.caller?.avatar_url} />
            <AvatarFallback>
              {incomingCall.caller?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="text-lg font-medium">
              {incomingCall.caller?.username || 'Unknown User'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {incomingCall.call_type === 'video' ? 'Video call' : 'Voice call'}
            </p>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full h-14 w-14"
              onClick={rejectCall}
            >
              {incomingCall.call_type === 'video' ? (
                <VideoOff className="h-6 w-6" />
              ) : (
                <PhoneOff className="h-6 w-6" />
              )}
            </Button>
            
            <Button
              className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600"
              onClick={acceptCall}
            >
              {incomingCall.call_type === 'video' ? (
                <Video className="h-6 w-6" />
              ) : (
                <Phone className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};