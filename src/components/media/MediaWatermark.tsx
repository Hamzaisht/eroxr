
import { generateWatermark } from "@/utils/media/urlUtils";

interface MediaWatermarkProps {
  creatorHandle?: string;
  className?: string;
}

export const MediaWatermark = ({ creatorHandle, className = "" }: MediaWatermarkProps) => {
  const watermarkText = generateWatermark(creatorHandle);

  return (
    <div className={`absolute bottom-2 right-2 z-30 pointer-events-none ${className}`}>
      <div className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
        {watermarkText}
      </div>
    </div>
  );
};
