import { useState, useRef, useCallback, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

interface UseCallSignalingProps {
  callId?: string;
  isInitiator?: boolean;
  onRemoteStream?: (stream: MediaStream) => void;
  onCallEnded?: () => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
}

export const useCallSignaling = ({
  callId,
  isInitiator = false,
  onRemoteStream,
  onCallEnded,
  onConnectionStateChange
}: UseCallSignalingProps) => {
  const session = useSession();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const signalingChannel = useRef<any>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);

  // Enhanced ICE servers configuration with TURN servers for better connectivity
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ];

  const createPeerConnection = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers,
      iceCandidatePoolSize: 10
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && signalingChannel.current) {
        console.log('🧊 Sending ICE candidate');
        signalingChannel.current.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            candidate: event.candidate,
            callId
          }
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log('📺 Received remote stream');
      if (event.streams && event.streams[0]) {
        onRemoteStream?.(event.streams[0]);
      }
    };

    peerConnection.current.onconnectionstatechange = () => {
      const state = peerConnection.current?.connectionState;
      console.log('🔗 Connection state changed:', state);
      setConnectionState(state || 'new');
      onConnectionStateChange?.(state || 'new');
      
      if (state === 'connected') {
        setIsConnected(true);
        console.log('✅ Call connected successfully');
      } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        setIsConnected(false);
        if (state === 'failed') {
          console.error('❌ Call connection failed');
        }
        onCallEnded?.();
      }
    };

    peerConnection.current.onicecandidateerror = (event) => {
      console.error('ICE candidate error:', event);
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log('🧊 ICE connection state:', peerConnection.current?.iceConnectionState);
    };

    return peerConnection.current;
  }, [callId, onRemoteStream, onCallEnded, onConnectionStateChange]);

  const initializeSignaling = useCallback(() => {
    if (!callId) return;

    console.log('📡 Initializing signaling for call:', callId);

    signalingChannel.current = supabase
      .channel(`call:${callId}`)
      .on('broadcast', { event: 'offer' }, async ({ payload }) => {
        console.log('📞 Received offer');
        if (!peerConnection.current) {
          createPeerConnection();
        }
        
        try {
          await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(payload.offer));
          
          // Process queued ICE candidates
          while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            if (candidate) {
              await peerConnection.current!.addIceCandidate(candidate);
            }
          }
          
          const answer = await peerConnection.current!.createAnswer();
          await peerConnection.current!.setLocalDescription(answer);
          
          console.log('📤 Sending answer');
          signalingChannel.current.send({
            type: 'broadcast',
            event: 'answer',
            payload: { answer }
          });
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      })
      .on('broadcast', { event: 'answer' }, async ({ payload }) => {
        console.log('📞 Received answer');
        if (!peerConnection.current) return;
        
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
          
          // Process queued ICE candidates
          while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            if (candidate) {
              await peerConnection.current.addIceCandidate(candidate);
            }
          }
        } catch (error) {
          console.error('Error handling answer:', error);
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
        console.log('🧊 Received ICE candidate');
        if (!peerConnection.current) return;
        
        try {
          const candidate = new RTCIceCandidate(payload.candidate);
          
          if (peerConnection.current.remoteDescription) {
            await peerConnection.current.addIceCandidate(candidate);
          } else {
            iceCandidatesQueue.current.push(candidate);
          }
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      })
      .on('broadcast', { event: 'call-ended' }, () => {
        console.log('📞 Call ended by remote party');
        onCallEnded?.();
      })
      .subscribe((status) => {
        console.log('📡 Signaling channel status:', status);
      });
  }, [callId, onCallEnded, createPeerConnection]);

  const startCall = useCallback(async (videoEnabled: boolean = true) => {
    try {
      console.log('🚀 Starting call with video:', videoEnabled);
      
      const constraints = {
        video: videoEnabled ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('🎥 Got user media');
      
      setLocalStream(stream);
      setIsVideoEnabled(videoEnabled);
      
      const pc = createPeerConnection();
      initializeSignaling();

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        console.log('➕ Adding track:', track.kind);
        pc.addTrack(track, stream);
      });

      if (isInitiator) {
        console.log('👑 Creating offer (initiator)');
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: videoEnabled
        });
        await pc.setLocalDescription(offer);
        
        console.log('📤 Sending offer');
        signalingChannel.current?.send({
          type: 'broadcast',
          event: 'offer',
          payload: { offer }
        });
      }
    } catch (error) {
      console.error('❌ Error starting call:', error);
      throw error;
    }
  }, [isInitiator, createPeerConnection, initializeSignaling]);

  const endCall = useCallback(async () => {
    console.log('📞 Ending call');
    
    // Notify other party
    if (signalingChannel.current) {
      signalingChannel.current.send({
        type: 'broadcast',
        event: 'call-ended',
        payload: {}
      });
    }

    // Clean up local stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log('🛑 Stopped track:', track.kind);
      });
      setLocalStream(null);
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Unsubscribe from signaling
    if (signalingChannel.current) {
      supabase.removeChannel(signalingChannel.current);
      signalingChannel.current = null;
    }

    // Clear ICE candidates queue
    iceCandidatesQueue.current = [];

    setIsConnected(false);
    setConnectionState('closed');

    // Update call status in database
    if (callId) {
      const now = new Date().toISOString();
      await supabase
        .from('call_history')
        .update({
          status: 'ended',
          ended_at: now
        })
        .eq('id', callId);
    }
  }, [localStream, callId]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
      console.log('🎤 Mute toggled:', !isMuted);
    }
  }, [localStream, isMuted]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
      console.log('📹 Video toggled:', !isVideoEnabled);
    }
  }, [localStream, isVideoEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up call signaling');
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (signalingChannel.current) {
        supabase.removeChannel(signalingChannel.current);
      }
    };
  }, [localStream]);

  return {
    localStream,
    isConnected,
    isMuted,
    isVideoEnabled,
    connectionState,
    startCall,
    endCall,
    toggleMute,
    toggleVideo
  };
};