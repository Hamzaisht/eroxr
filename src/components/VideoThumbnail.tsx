import { useState } from "react";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { getPlayableMediaUrl, extractMediaUrl } from "@/utils/media/urlUtils";

interface VideoThumbnailProps {
  videoUrl?: string;
  isHovered: boolean;
  isMobile: boolean;
  className?: string; // Added className prop
}

export const VideoThumbnail = ({ videoUrl, isHovered, isMobile, className }: VideoThumbnailProps) => {
  // Since we have a TODO to track playback state in the future, we'll keep the state
  // but properly implement it with our current VideoPlayer component capabilities
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Process and validate video URL
  const url = videoUrl ? extractMediaUrl({ url: videoUrl }) : null;
  const processedUrl = url ? getPlayableMediaUrl(url) : null;
  
  if (!processedUrl) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-luxury-darker ${className || ''}`}>
        <p className="text-luxury-neutral">No video</p>
      </div>
    );
  }

  const handleError = () => {
    console.error("Video thumbnail error:", videoUrl);
  };

  // The VideoPlayer component accepts an onLoadedData callback
  const handleLoadedData = () => {
    // We can log that the video is ready to play
    console.log("Video loaded, ready to play");
    
    // If video is autoplaying (when hovered), update our playing state
    if (isHovered) {
      setIsPlaying(true);
    }
  };

  if (isMobile) {
    return (
      <VideoPlayer 
        url={processedUrl}
        className={`w-full h-full ${className || ''}`}
        autoPlay={isHovered}
        playOnHover={false}
        onError={handleError}
        onLoadedData={handleLoadedData}
      />
    );
  }

  return (
    <>
      {!isHovered && (
        <div className="absolute inset-0 z-10 bg-black">
          <img
            src={processedUrl}
            alt="Video thumbnail"
            className={`w-full h-full object-cover ${className || ''}`}
            onError={(e) => {
              console.error("Thumbnail load error:", videoUrl);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <VideoPlayer 
        url={processedUrl} 
        className={`w-full h-full ${className || ''}`}
        playOnHover={true}
        autoPlay={isHovered}
        onError={handleError}
        onLoadedData={handleLoadedData}
      />
    </>
  );
};
