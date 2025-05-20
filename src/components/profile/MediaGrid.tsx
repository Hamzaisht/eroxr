
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaSource } from "@/types/media";

export interface MediaGridProps {
  items: MediaSource[];
  onItemClick?: (item: MediaSource) => void;
}

export function MediaGrid({ items, onItemClick }: MediaGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-md">
        <p className="text-muted-foreground">No media items</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition"
          onClick={() => onItemClick && onItemClick(item)}
        >
          <UniversalMedia
            item={item}
            className="w-full h-full object-cover"
            controls={false}
            muted={true}
            autoPlay={false}
            poster={item.thumbnail}
          />
        </div>
      ))}
    </div>
  );
}
