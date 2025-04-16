
import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Video, Play, Loader2, Ghost } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGhostMode } from "@/hooks/useGhostMode";
import { useSession } from "@supabase/auth-helpers-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface VideoMessageProps {
  messageId: string;
  videoUrl: string;
  isViewed: boolean;
  onView: () => void;
}

export const VideoMessage = ({ messageId, videoUrl, isViewed, onView }: VideoMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { isGhostMode = false } = useGhostMode();
  const session = useSession();

  const mediaItem = { 
    video_url: videoUrl,
    media_type: MediaType.VIDEO
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = () => setIsLoading(false);
      videoRef.current.onerror = () => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load video",
          variant: "destructive",
        });
      };
    }
  }, [toast]);

  const handlePlay = async () => {
    setIsPlaying(true);
    
    // In Ghost Mode, we view the content but don't mark it as viewed
    if (isGhostMode) {
      // Log this action for audit purposes
      if (session?.user?.id) {
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: 'ghost_view_video',
          details: {
            message_id: messageId,
            video_url: videoUrl,
            timestamp: new Date().toISOString()
          }
        });
      }
      return;
    }
    
    // Normal behavior for non-ghost mode
    onView();
    
    // Mark message as viewed in database
    const { error } = await supabase
      .from('direct_messages')
      .update({ viewed_at: new Date().toISOString() })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as viewed:', error);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  // In ghost mode, we can view expired content
  const showExpiredMessage = isViewed && !isGhostMode;

  if (showExpiredMessage) {
    return (
      <div className="text-center text-muted-foreground p-4">
        This video message has expired
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {isPlaying ? (
        <UniversalMedia
          item={mediaItem}
          className="w-full h-full object-contain"
          onEnded={handleEnded}
          autoPlay={true}
          controls={false}
        />
      ) : (
        <Button
          onClick={handlePlay}
          className="absolute inset-0 w-full h-full bg-black/50 hover:bg-black/60"
        >
          <Play className="h-12 w-12" />
        </Button>
      )}
      
      {isGhostMode && isViewed && (
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1">
          <Ghost className="h-3 w-3 text-purple-400" />
          <span>Ghost View</span>
        </div>
      )}
    </div>
  );
};
