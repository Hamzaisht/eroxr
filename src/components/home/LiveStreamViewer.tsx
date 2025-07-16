
import { useState, useEffect, useRef } from 'react';
import { useGhostMode } from '@/hooks/useGhostMode';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface LiveStreamViewerProps {
  streamId?: string;
  playbackUrl?: string;
  className?: string;
}

export const LiveStreamViewer = ({ 
  streamId, 
  playbackUrl,
  className = "" 
}: LiveStreamViewerProps) => {
  const { isGhostMode } = useGhostMode();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamId) {
      // Join stream as viewer for presence tracking
      const channel = supabase
        .channel(`stream:${streamId}`)
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          setViewerCount(Object.keys(state).length);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: 'viewer_' + Math.random().toString(36).substring(7),
              online_at: new Date().toISOString()
            });
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [streamId]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  if (!playbackUrl) {
    return (
      <div className={`bg-luxury-darker rounded-lg p-8 ${className}`}>
        <div className="text-center text-luxury-neutral">
          <p>No active stream</p>
          {isGhostMode && (
            <p className="text-luxury-primary text-sm mt-2">Ghost Mode Active</p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className={`relative bg-luxury-darker rounded-lg overflow-hidden ${className}`}
    >
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted={isMuted}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={playbackUrl} type="application/x-mpegURL" />
        Your browser does not support HLS video.
      </video>

      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
        {/* Top Info Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
            LIVE
          </div>
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            {viewerCount} viewers
          </div>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            <Maximize size={16} />
          </Button>
        </div>
      </div>

      {isGhostMode && (
        <div className="absolute top-2 right-2 bg-luxury-primary/20 text-luxury-primary text-xs px-2 py-1 rounded">
          Ghost Mode
        </div>
      )}
    </div>
  );
};
