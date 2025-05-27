
import { MediaItem } from "@/utils/media/types";
import { UniversalMediaRenderer } from "./UniversalMediaRenderer";

interface MediaGridProps {
  items: MediaItem[];
  className?: string;
  showWatermark?: boolean;
  onAccessRequired?: (type: 'subscription' | 'purchase' | 'login', mediaId?: string) => void;
}

export const MediaGrid = ({ 
  items, 
  className = "", 
  showWatermark = true,
  onAccessRequired 
}: MediaGridProps) => {
  if (items.length === 0) return null;

  const gridClassName = items.length === 1 
    ? "grid-cols-1" 
    : items.length === 2 
    ? "grid-cols-2" 
    : "grid-cols-2 md:grid-cols-3";

  return (
    <div className={`grid gap-2 ${gridClassName} ${className}`}>
      {items.map((media, index) => (
        <div 
          key={media.id || index} 
          className="aspect-square rounded-lg overflow-hidden"
        >
          <UniversalMediaRenderer
            media={media}
            showWatermark={showWatermark}
            className="w-full h-full"
            onAccessRequired={(type) => onAccessRequired?.(type, media.id)}
          />
        </div>
      ))}
    </div>
  );
};
