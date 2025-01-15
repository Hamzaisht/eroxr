import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
}

export const VideoPlayer = ({ url, poster, className = "", onError }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // If it's already a full URL, use it directly
        if (url.startsWith('http')) {
          setVideoUrl(url);
          return;
        }

        // Extract bucket name and file path
        const parts = url.split('/');
        const bucketName = parts[0] || 'posts'; // Default to 'posts' bucket if not specified
        const filePath = parts.slice(1).join('/');

        console.log("Getting video URL for bucket:", bucketName, "path:", filePath);

        // Try to get a public URL first
        const { data: publicData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          console.log("Using public URL:", publicData.publicUrl);
          setVideoUrl(publicData.publicUrl);
          return;
        }

        // If public URL fails, try signed URL
        const { data: signedData, error: signedError } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(filePath, 3600);

        if (signedError) {
          console.error("Error getting signed URL:", signedError);
          throw signedError;
        }

        if (signedData?.signedUrl) {
          console.log("Using signed URL:", signedData.signedUrl);
          setVideoUrl(signedData.signedUrl);
        } else {
          throw new Error("Could not generate video URL");
        }
      } catch (error) {
        console.error('Error loading video:', error);
        setHasError(true);
        onError?.();
        toast({
          title: "Error loading video",
          description: "Failed to load video content. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      loadVideo();
    }
  }, [url, onError, toast]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing video:", error);
          toast({
            title: "Playback Error",
            description: "Unable to play video. Please try again.",
            variant: "destructive",
          });
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-luxury-darker aspect-video rounded-lg ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  if (hasError || !videoUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-luxury-darker aspect-video rounded-lg ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-sm text-luxury-neutral">Failed to load video</p>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="w-full h-full object-cover rounded-lg"
        playsInline
        loop
        muted={isMuted}
        onLoadedData={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Video error:", e);
          setHasError(true);
          onError?.();
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex gap-4">
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};