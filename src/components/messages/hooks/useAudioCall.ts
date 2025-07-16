import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseAudioCallProps {
  recipientId: string;
  recipientUsername: string;
}

export const useAudioCall = ({ recipientId, recipientUsername }: UseAudioCallProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);

  const initiateAudioCall = useCallback(async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make calls",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create call record in database
      const { data: callRecord, error } = await supabase
        .from('call_history')
        .insert({
          caller_id: session.user.id,
          recipient_id: recipientId,
          call_type: 'audio',
          status: 'initiated'
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification to recipient
      await supabase
        .from('call_notifications')
        .insert({
          user_id: recipientId,
          call_id: callRecord.id,
          notification_type: 'incoming_call'
        });

      // Open call dialog
      setIsCallDialogOpen(true);

      toast({
        title: "Calling...",
        description: `Calling ${recipientUsername}`,
      });

    } catch (error) {
      console.error('Error initiating call:', error);
      toast({
        title: "Call failed",
        description: "Could not initiate the call. Please try again.",
        variant: "destructive"
      });
    }
  }, [session?.user?.id, recipientId, recipientUsername, toast]);

  const endCall = useCallback(() => {
    setIsCallDialogOpen(false);
  }, []);

  return {
    isCallDialogOpen,
    initiateAudioCall,
    endCall,
    setIsCallDialogOpen
  };
};