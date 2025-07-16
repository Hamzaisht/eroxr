
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCallSignaling } from '../hooks/useCallSignaling';

interface CallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callType: 'audio' | 'video';
  recipient: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export const CallDialog = ({ isOpen, onClose, callType, recipient }: CallDialogProps) => {
  const [callState, setCallState] = useState<'initiating' | 'ringing' | 'connected' | 'ended' | 'failed'>('initiating');
  const [callDuration, setCallDuration] = useState(0);
  const [callId, setCallId] = useState<string | null>(null);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<number | null>(null);
  
  const session = useSession();
  const { toast } = useToast();

  const {
    localStream,
    isConnected,
    isMuted,
    isVideoEnabled,
    connectionState,
    startCall,
    endCall,
    toggleMute,
    toggleVideo
  } = useCallSignaling({
    callId: callId || undefined,
    isInitiator: true,
    onRemoteStream: (stream) => {
      console.log('🎥 Setting remote stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    },
    onCallEnded: () => {
      console.log('📞 Call ended callback');
      handleCallEnd();
    },
    onConnectionStateChange: (state) => {
      console.log('🔗 Connection state:', state);
      if (state === 'connected' && callState !== 'connected') {
        setCallState('connected');
        setCallStartTime(new Date());
        startCallTimer();
        
        // Update database
        if (callId) {
          supabase.from('call_history').update({
            status: 'connected',
            connected_at: new Date().toISOString()
          }).eq('id', callId);
        }
      } else if (state === 'failed') {
        setCallState('failed');
        toast({
          title: "Call Failed",
          description: "Connection failed. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const handleCallEnd = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    
    setCallState('ended');
    
    // Calculate duration for database
    const duration = callStartTime ? Math.floor((Date.now() - callStartTime.getTime()) / 1000) : 0;
    
    // Update database with final call status
    if (callId) {
      supabase.from('call_history').update({
        status: 'ended',
        ended_at: new Date().toISOString(),
        duration
      }).eq('id', callId);
    }
    
    setTimeout(onClose, 1500);
  }, [callStartTime, callId, onClose]);
  
  // Initialize call
  useEffect(() => {
    const initializeCall = async () => {
      if (!isOpen || !session?.user?.id || callId) return;

      try {
        console.log('🚀 Initializing call');
        
        // Generate unique call ID
        const newCallId = `call_${session.user.id}_${recipient.id}_${Date.now()}`;
        setCallId(newCallId);

        // Create call record in database
        const { error } = await supabase.from('call_history').insert({
          id: newCallId,
          caller_id: session.user.id,
          recipient_id: recipient.id,
          call_type: callType,
          status: 'initiated'
        });

        if (error) throw error;

        // Send notification to recipient
        await supabase.from('call_notifications').insert({
          user_id: recipient.id,
          call_id: newCallId,
          notification_type: 'incoming_call'
        });

        // Start call using signaling hook
        await startCall(callType === 'video');
        
        setCallState('ringing');
        console.log('📞 Call initiated, state: ringing');

      } catch (error) {
        console.error('❌ Error starting call:', error);
        toast({
          title: "Call Failed",
          description: "Could not start the call. Please check your permissions.",
          variant: "destructive"
        });
        setCallState('failed');
        setTimeout(onClose, 1500);
      }
    };

    if (isOpen) {
      initializeCall();
    }
  }, [isOpen, session?.user?.id, recipient.id, callType, startCall, toast, callId, onClose]);
  
  // Set up local video stream display
  useEffect(() => {
    if (localStream && localVideoRef.current && callType === 'video') {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callType]);
  
  // Start call timer
  const startCallTimer = () => {
    callTimerRef.current = window.setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };
  
  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Use the functions from the hook instead of duplicating
  
  // End call handler that uses the hook's endCall function
  const handleEndCall = async () => {
    console.log('🔚 Ending call manually');
    await endCall();
    handleCallEnd();
  };
  
  // UI for different call states
  const renderCallUI = () => {
    switch (callState) {
      case 'initiating':
      case 'ringing':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={recipient.avatar_url || ""} />
              <AvatarFallback>{recipient.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-medium">{recipient.username}</h3>
              <p className="text-luxury-neutral/70">
                {callState === 'initiating' ? 'Calling...' : 'Ringing...'}
              </p>
            </div>
          </div>
        );
        
      case 'connected':
        return (
          <div className="flex flex-col h-full">
            {/* Call duration */}
            <div className="text-center py-2 bg-black/30">
              <p className="text-sm font-mono">{formatDuration(callDuration)}</p>
            </div>
            
            {/* Video area */}
            <div className="flex-1 relative">
              {callType === 'video' ? (
                <>
                  {/* Remote video (full size) */}
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Local video (picture-in-picture) */}
                  <div className="absolute bottom-4 right-4 w-1/4 border border-white/20 rounded-lg overflow-hidden shadow-lg">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                </>
              ) : (
                // Audio call UI
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={recipient.avatar_url || ""} />
                    <AvatarFallback>{recipient.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-medium">{recipient.username}</h3>
                </div>
              )}
            </div>
            
            {/* Call controls */}
            <div className="bg-black/40 p-4 flex justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/10'} h-12 w-12`}
                onClick={toggleMute}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </Button>
              
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={handleEndCall}
              >
                <PhoneOff size={20} />
              </Button>
              
              {callType === 'video' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${!isVideoEnabled ? 'bg-red-500/20 text-red-500' : 'bg-white/10'} h-12 w-12`}
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                </Button>
              )}
            </div>
          </div>
        );
        
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-red-500/20 p-4 rounded-full">
              <PhoneOff size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-medium text-red-400">Call Failed</h3>
            <p className="text-luxury-neutral/70">Could not connect to {recipient.username}</p>
          </div>
        );
        
      case 'ended':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-gray-500/20 p-4 rounded-full">
              <PhoneOff size={32} className="text-gray-400" />
            </div>
            <p className="text-luxury-neutral/70">Call ended</p>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] p-0 overflow-hidden bg-luxury-darker border-luxury-primary/20">
        <div className="h-[70vh]">
          {renderCallUI()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
