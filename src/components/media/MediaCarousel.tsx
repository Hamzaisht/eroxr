
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem } from "@/utils/media/types";
import { UniversalMediaRenderer } from "./UniversalMediaRenderer";
import { Button } from "@/components/ui/button";

interface MediaCarouselProps {
  items: MediaItem[];
  className?: string;
  showWatermark?: boolean;
  autoPlay?: boolean;
  onAccessRequired?: (type: 'subscription' | 'purchase' | 'login', mediaId: string) => void;
}

export const MediaCarousel = ({ 
  items, 
  className = "", 
  showWatermark = true,
  autoPlay = false,
  onAccessRequired 
}: MediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const currentMedia = items[currentIndex];

  return (
    <div className={`relative ${className}`}>
      <UniversalMediaRenderer
        media={currentMedia}
        showWatermark={showWatermark}
        autoPlay={autoPlay}
        className="w-full h-full"
        onAccessRequired={(type) => onAccessRequired?.(type, currentMedia.id)}
      />

      {/* Navigation Controls */}
      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
