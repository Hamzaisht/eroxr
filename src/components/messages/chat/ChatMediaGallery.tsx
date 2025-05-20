
import { cn } from "@/lib/utils";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface ChatMediaGalleryProps {
  images?: string[];
  videos?: string[];
  userId?: string;
  onMediaClick?: (url: string) => void;
}

export const ChatMediaGallery = ({ images, videos, userId, onMediaClick }: ChatMediaGalleryProps) => {
  const renderImages = () => {
    if (!images || images.length === 0) return null;
    
    return (
      <div className={cn("grid grid-cols-2 gap-1", images.length === 1 && "grid-cols-1")}>
        {images.map((image, i) => (
          <div key={`img-${i}`} className="relative aspect-square">
            <UniversalMedia
              item={{
                url: image,
                type: MediaType.IMAGE,
                media_url: image,
                creator_id: userId || undefined
              }}
              className="w-full h-full object-cover rounded-md cursor-pointer"
              showWatermark={false}
              onClick={() => onMediaClick?.(image)}
            />
          </div>
        ))}
      </div>
    );
  };
  
  const renderVideos = () => {
    if (!videos || videos.length === 0) return null;
    
    return (
      <div className={cn("grid grid-cols-2 gap-1", videos.length === 1 && "grid-cols-1")}>
        {videos.map((video, i) => (
          <div key={`vid-${i}`} className="relative aspect-square">
            <UniversalMedia
              item={{
                url: video,
                type: MediaType.VIDEO,
                media_url: video,
                creator_id: userId || undefined
              }}
              className="w-full h-full object-cover rounded-md cursor-pointer"
              controls={true}
              autoPlay={false}
              muted={true}
              showWatermark={false}
              onClick={() => onMediaClick?.(video)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {renderImages()}
      {renderVideos()}
    </div>
  );
};
