
import { UniversalMedia } from "@/components/shared/media/UniversalMedia";
import { MediaSource } from "@/types/media";

interface MediaGridProps {
  items: MediaSource[];
  onItemClick: (item: MediaSource) => void;
}

export function MediaGrid({ items, onItemClick }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {items.map((item, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-md">
          <UniversalMedia
            item={{
              url: item.url,
              type: item.type,
              // Use optional chaining for thumbnail
              ...(item.thumbnail ? { thumbnail: item.thumbnail } : {})
            }}
            className="w-full h-full object-cover"
            showWatermark={false}
            onClick={() => onItemClick(item)}
          />
        </div>
      ))}
    </div>
  );
}
