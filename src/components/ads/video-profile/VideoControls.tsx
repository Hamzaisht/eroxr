
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/types/media";
import { AlertCircle } from 'lucide-react';

interface VideoControlsProps {
  videoUrl: string | null;
  avatarUrl: string | null;
  isActive: boolean;
}

export const VideoControls = ({ videoUrl, avatarUrl, isActive }: VideoControlsProps) => {
  const { toast } = useToast();
  const [hasError, setHasError] = useState(false);
  
  const mediaItem = {
    url: videoUrl || avatarUrl || '',
    type: videoUrl ? MediaType.VIDEO : MediaType.IMAGE,
    poster: avatarUrl || undefined,
  };
  
  const handleError = () => {
    console.error("VideoControls error:", videoUrl);
    setHasError(true);
    toast({
      title: "Video Error",
      description: "Failed to play video content. Please try again later.",
      variant: "destructive",
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      {videoUrl && !hasError ? (
        <UniversalMedia
          item={mediaItem}
          className="h-full w-full object-cover"
          autoPlay={isActive}
          controls={false}
          onError={handleError}
          maxRetries={2}
        />
      ) : (
        <div className="h-full w-full bg-luxury-darker/50 backdrop-blur-xl flex flex-col items-center justify-center">
          {hasError ? (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
              <p className="text-luxury-neutral text-center px-4">Failed to load video</p>
            </>
          ) : (
            <p className="text-luxury-neutral">No video available</p>
          )}
          {avatarUrl && (
            <div className="w-full h-full absolute inset-0 z-0 opacity-30">
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
