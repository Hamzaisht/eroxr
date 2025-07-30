
import { useShortsFeed } from "./hooks/useShortsFeed";
import { useShortNavigation } from "./hooks/useShortNavigation";
import { ShortVideoPlayer } from "./components/ShortVideoPlayer";
import { ShortNavigationButtons } from "./components/ShortNavigationButtons";
import { useState } from "react";

interface ShortsFeedProps {
  specificShortId?: string | null;
}

export const ShortsFeed = ({ specificShortId }: ShortsFeedProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const {
    shorts,
    currentVideoIndex,
    setCurrentVideoIndex,
    isLoading,
    isError,
    handleRetryLoad
  } = useShortsFeed(specificShortId);

  const { handleScroll, handleTouchStart, handleTouchEnd } = useShortNavigation({
    currentVideoIndex,
    setCurrentVideoIndex,
    totalShorts: shorts.length,
    setIsMuted
  });

  const handleNextClick = () => {
    if (currentVideoIndex < shorts.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsMuted(false);
    }
  };

  const handlePrevClick = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsMuted(false);
    }
  };

  const handleVideoError = () => {
    console.error('Video error for short:', shorts[currentVideoIndex]?.id);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading shorts...</p>
        </div>
      </div>
    );
  }

  if (isError || shorts.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Failed to load shorts</p>
          <button 
            onClick={handleRetryLoad}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentShort = shorts[currentVideoIndex];

  return (
    <div 
      className="h-screen w-full relative overflow-hidden bg-black touch-manipulation"
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Video Player */}
      {currentShort && (
        <ShortVideoPlayer
          videoUrl={currentShort.video_urls?.[0] || null}
          thumbnailUrl={currentShort.video_urls?.[1] || undefined}
          creatorId={currentShort.creator_id}
          isCurrentVideo={true}
          onError={handleVideoError}
        />
      )}

      {/* Navigation Buttons */}
      <ShortNavigationButtons
        currentVideoIndex={currentVideoIndex}
        totalShorts={shorts.length}
        onNextClick={handleNextClick}
        onPrevClick={handlePrevClick}
      />

      {/* Touch Navigation Areas for Mobile */}
      <div className="absolute inset-0 z-20 flex md:hidden">
        {/* Left half - Previous */}
        <div 
          className="flex-1 h-full"
          onClick={handlePrevClick}
          style={{ touchAction: 'manipulation' }}
        />
        {/* Right half - Next */}
        <div 
          className="flex-1 h-full"
          onClick={handleNextClick}
          style={{ touchAction: 'manipulation' }}
        />
      </div>

      {/* Creator Info */}
      {currentShort && (
        <div className="absolute bottom-safe left-4 right-20 z-30 text-white">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={currentShort.creator?.avatar_url || '/placeholder.svg'} 
              alt={currentShort.creator?.username || 'Creator'}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{currentShort.creator?.username || 'Anonymous'}</span>
          </div>
          {currentShort.content && (
            <p className="text-sm text-white/90 line-clamp-2">{currentShort.content}</p>
          )}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="absolute top-safe left-4 right-4 z-30">
        <div className="flex gap-1">
          {shorts.map((_, index) => (
            <div
              key={index}
              className={`h-0.5 flex-1 rounded transition-colors ${
                index === currentVideoIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
