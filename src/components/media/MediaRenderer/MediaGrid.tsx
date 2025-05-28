
interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  alt_text?: string;
  original_name?: string;
  user_id?: string;
  metadata?: {
    post_id?: string;
    [key: string]: any;
  };
}

interface MediaGridProps {
  mediaArray: MediaAsset[];
  renderSingleMedia: (mediaItem: MediaAsset, index: number) => React.ReactNode;
  className?: string;
}

export const MediaGrid = ({ mediaArray, renderSingleMedia, className }: MediaGridProps) => {
  return (
    <div className={`grid grid-cols-2 gap-1 ${className}`}>
      {mediaArray.slice(0, 4).map((mediaItem, index) => (
        <div key={mediaItem.id || index} className="relative aspect-square">
          {renderSingleMedia(mediaItem, index)}
          {index === 3 && mediaArray.length > 4 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                +{mediaArray.length - 4}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
