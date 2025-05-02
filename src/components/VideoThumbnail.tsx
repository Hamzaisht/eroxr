import { VideoPlayer } from "@/components/video/VideoPlayer";
import { getPlayableMediaUrl } from "@/utils/media/mediaUrlUtils";

interface VideoThumbnailProps {
  videoUrl?: string;
  isHovered: boolean;
  isMobile: boolean;
}

export const VideoThumbnail = ({ videoUrl, isHovered, isMobile }: VideoThumbnailProps) => {
  if (!videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-luxury-darker">
        <p className="text-luxury-neutral">No video</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <VideoPlayer 
        url={videoUrl}
        className="w-full h-full"
        autoPlay={isHovered}
        playOnHover={false}
      />
    );
  }

  return (
    <>
      {!isHovered && (
        <div className="absolute inset-0 z-10 bg-black">
          <img
            src={getPlayableMediaUrl(videoUrl)}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <VideoPlayer 
        url={videoUrl} 
        className="w-full h-full"
        playOnHover={true}
        autoPlay={isHovered}
      />
    </>
  );
};
