
import { useState, useEffect } from "react";
import { DatingAd } from "@/types/dating";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/types/media"; 

interface VideoProfileCarouselProps {
  ads: DatingAd[];
}

export const VideoProfileCarousel = ({ ads }: VideoProfileCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Reset player state when ads change
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [ads]);
  
  // No ads to display
  if (!ads || ads.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No video profiles available
      </div>
    );
  }
  
  const currentAd = ads[currentIndex];
  
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="aspect-[4/3] md:aspect-video relative bg-black overflow-hidden rounded-xl">
        <UniversalMedia
          item={{
            url: currentAd.videoUrl || '',
            type: MediaType.VIDEO,
            poster: currentAd.avatarUrl
          }}
          className="w-full h-full object-cover"
          autoPlay={true}
          controls={true}
          muted={false}
          loop={true}
          onError={() => console.error("Error playing ad video", currentAd.id)}
        />
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{currentAd.title}</h3>
          <p className="text-sm text-luxury-neutral/70">{currentAd.description?.substring(0, 120)}...</p>
        </div>
      </div>
      
      {ads.length > 1 && (
        <div className="mt-3 flex justify-center gap-1">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full ${
                index === currentIndex ? "bg-luxury-primary" : "bg-luxury-neutral/20"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
