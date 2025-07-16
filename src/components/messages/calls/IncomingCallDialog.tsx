import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Phone, PhoneOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CallDialog } from './CallDialog';

interface IncomingCallDialogProps {
  callId: string;
  caller: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  callType: 'audio' | 'video';
  onDismiss: () => void;
}

export const IncomingCallDialog = ({ callId, caller, callType, onDismiss }: IncomingCallDialogProps) => {
  const [showAnswerDialog, setShowAnswerDialog] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  // Auto dismiss after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDecline();
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = async () => {
    try {
      // Update call status
      await supabase
        .from('call_history')
        .update({ status: 'connected', connected_at: new Date().toISOString() })
        .eq('id', callId);

      // Mark notification as read
      await supabase
        .from('call_notifications')
        .update({ is_read: true })
        .eq('call_id', callId)
        .eq('user_id', session?.user?.id);

      setShowAnswerDialog(true);
      onDismiss();
    } catch (error) {
      console.error('Error answering call:', error);
      toast({
        title: "Error",
        description: "Could not answer the call",
        variant: "destructive"
      });
    }
  };

  const handleDecline = async () => {
    try {
      // Update call status to missed
      await supabase
        .from('call_history')
        .update({ status: 'missed', ended_at: new Date().toISOString() })
        .eq('id', callId);

      // Create missed call notification
      await supabase
        .from('call_notifications')
        .insert({
          user_id: caller.id,
          call_id: callId,
          notification_type: 'missed_call'
        });

      onDismiss();
    } catch (error) {
      console.error('Error declining call:', error);
      onDismiss();
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={() => handleDecline()}>
        <DialogContent className="sm:max-w-md p-6 bg-luxury-darker border-luxury-primary/20">
          <div className="flex flex-col items-center space-y-6">
            {/* Incoming call indicator */}
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={caller.avatar_url || ""} />
                <AvatarFallback>{caller.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <Phone size={12} className="text-white" />
              </div>
            </div>

            {/* Caller info */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white">{caller.username}</h3>
              <p className="text-sm text-luxury-neutral/70">
                Incoming {callType} call
              </p>
            </div>

            {/* Call actions */}
            <div className="flex space-x-8">
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-14 w-14"
                onClick={handleDecline}
              >
                <PhoneOff size={24} />
              </Button>
              
              <Button
                className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600"
                onClick={handleAnswer}
              >
                <Phone size={24} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Show call dialog when answered */}
      {showAnswerDialog && (
        <CallDialog
          isOpen={showAnswerDialog}
          onClose={() => setShowAnswerDialog(false)}
          callType={callType}
          recipient={caller}
        />
      )}
    </>
  );
};