
import { useState, useEffect, useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

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
  const [callState, setCallState] = useState<'initiating' | 'ringing' | 'connected' | 'ended'>('initiating');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const [callId] = useState(uuidv4());
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callTimerRef = useRef<number | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  
  // Initialize media devices
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const constraints = {
          audio: true,
          video: callType === 'video'
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;
        
        if (localVideoRef.current && callType === 'video') {
          localVideoRef.current.srcObject = stream;
        }
        
        // Set up peer connection
        initializePeerConnection();
        
        // Simulate call state progression (for demo)
        setCallState('ringing');
        setTimeout(() => {
          setCallState('connected');
          startCallTimer();
        }, 2000);
        
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: "Media Error",
          description: "Could not access camera or microphone",
          variant: "destructive"
        });
        handleEndCall();
      }
    };
    
    if (isOpen) {
      initializeMedia();
      
      // Send call notification through Supabase channel
      const callChannel = supabase.channel(`call:${callId}`);
      callChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await callChannel.send({
            type: 'broadcast',
            event: 'call_request',
            payload: {
              call_id: callId,
              caller_id: session?.user?.id,
              caller_name: session?.user?.email, // Use profile name in production
              call_type: callType,
              recipient_id: recipient.id
            }
          });
        }
      });
      
      return () => {
        supabase.removeChannel(callChannel);
      };
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen, callType, recipient.id, session?.user?.id, toast]);
  
  // Initialize WebRTC peer connection
  const initializePeerConnection = () => {
    // This is a simplified version - in a real app, you would need:
    // 1. ICE servers configuration
    // 2. Signaling server or channel
    // 3. STUN/TURN servers for NAT traversal
    
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };
    
    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;
    
    // Add local tracks to the connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }
    
    // Handle incoming remote tracks
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    
    // Handle connection state changes
    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
      
      if (pc.iceConnectionState === 'disconnected' || 
          pc.iceConnectionState === 'failed' ||
          pc.iceConnectionState === 'closed') {
        handleEndCall();
      }
    };
    
    // Note: In a real application, you would handle signaling here
    // For demo purposes, we're simulating a successful connection
  };
  
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
  
  // Toggle mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (callType === 'video' && localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };
  
  // End call
  const handleEndCall = () => {
    cleanup();
    setCallState('ended');
    
    // Record call in database (in a real app)
    const logCall = async () => {
      if (session?.user?.id && recipient.id) {
        try {
          await supabase.from('call_logs').insert({
            caller_id: session.user.id,
            recipient_id: recipient.id,
            call_type: callType,
            duration_seconds: callDuration,
            call_id: callId
          });
        } catch (error) {
          console.error('Error logging call:', error);
        }
      }
    };
    
    // Log call attempt even if table doesn't exist yet
    logCall().catch(() => {});
    
    setTimeout(onClose, 1000);
  };
  
  // Cleanup resources
  const cleanup = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
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
        
      case 'ended':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-red-500/20 p-4 rounded-full">
              <PhoneOff size={32} className="text-red-500" />
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
