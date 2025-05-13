
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Create these files as needed
import { CarouselControls } from './CarouselControls';
import { CarouselEmpty } from './CarouselEmpty';

interface VideoProfileCarouselProps {
  ads?: any[];
  title?: string;
  emptyMessage?: string;
  onViewMore?: () => void;
}

export const VideoProfileCarousel = ({
  ads = [],
  title = "Dating Videos",
  emptyMessage = "No videos available",
  onViewMore
}: VideoProfileCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Reset index when ads change
  useEffect(() => {
    setCurrentIndex(0);
  }, [ads]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : ads.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < ads.length - 1 ? prev + 1 : 0));
  };

  if (!ads || ads.length === 0) {
    return <CarouselEmpty message={emptyMessage} />;
  }

  return (
    <Card className="relative overflow-hidden bg-gray-900 rounded-lg">
      <div className="flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          
          {onViewMore && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onViewMore}
              className="text-gray-300 hover:text-white"
            >
              View All
            </Button>
          )}
        </div>
        
        <div className="relative h-[400px]">
          {/* Main video display */}
          <div className="relative w-full h-full">
            {ads[currentIndex] && (
              <video
                src={ads[currentIndex].video_url || ads[currentIndex].media_url}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            )}
            
            {/* Overlay with profile info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                  <img 
                    src={ads[currentIndex]?.avatar_url || "/placeholder-avatar.png"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white">{ads[currentIndex]?.title || "Anonymous"}</h3>
                  <p className="text-sm text-gray-300">{ads[currentIndex]?.location || "Unknown location"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation controls */}
          <CarouselControls 
            onPrevious={handlePrevious} 
            onNext={handleNext} 
            totalItems={ads.length} 
            currentIndex={currentIndex}
          />
        </div>
      </div>
    </Card>
  );
};
