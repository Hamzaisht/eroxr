import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Video, Play, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    if (videoRef.current && !isViewed) {
      setIsPlaying(true);
      videoRef.current.play();
      onView();
      
      // Mark message as viewed in database
      const { error } = await supabase
        .from('direct_messages')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) {
        console.error('Error marking message as viewed:', error);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.style.display = 'none';
    }
  };

  if (isViewed) {
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
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onEnded={handleEnded}
        style={{ display: isPlaying ? 'block' : 'none' }}
      />
      {!isPlaying && !isViewed && (
        <Button
          onClick={handlePlay}
          className="absolute inset-0 w-full h-full bg-black/50 hover:bg-black/60"
        >
          <Play className="h-12 w-12" />
        </Button>
      )}
    </div>
  );
};