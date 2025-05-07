
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { getPlayableMediaUrl, extractMediaUrl } from "@/utils/media/urlUtils";

interface VideoThumbnailProps {
  videoUrl?: string;
  isHovered: boolean;
  isMobile: boolean;
}

export const VideoThumbnail = ({ videoUrl, isHovered, isMobile }: VideoThumbnailProps) => {
  // Process and validate video URL
  const url = videoUrl ? extractMediaUrl({ url: videoUrl }) : null;
  const processedUrl = url ? getPlayableMediaUrl(url) : null;
  
  if (!processedUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-luxury-darker">
        <p className="text-luxury-neutral">No video</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <VideoPlayer 
        url={processedUrl}
        className="w-full h-full"
        autoPlay={isHovered}
        playOnHover={false}
        onError={(e) => console.error("Video thumbnail error:", videoUrl, e)}
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
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Thumbnail load error:", videoUrl);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <VideoPlayer 
        url={processedUrl} 
        className="w-full h-full"
        playOnHover={true}
        autoPlay={isHovered}
        onError={(e) => console.error("Video player error:", videoUrl, e)}
      />
    </>
  );
};
