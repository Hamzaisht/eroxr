
import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useShortsFeed } from "./hooks/useShortsFeed";
import { useRealtimeShorts } from "./hooks/useRealtimeShorts";
import { useShortNavigation } from "./hooks/useShortNavigation";
import { ShortsLoadingIndicator } from "./components/ShortsLoadingIndicator";
import { ShortNavigationButtons } from "./components/ShortNavigationButtons";
import { EmptyShortsState } from "./components/EmptyShortsState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useTrackingAction } from "./hooks/actions/useTrackingAction";
import { ShortItem } from "./components/ShortItem";

interface ShortsFeedProps {
  specificShortId?: string | null;
}

export const ShortsFeed = ({ specificShortId }: ShortsFeedProps) => {
  // State
  const [isMuted, setIsMuted] = useState(true);
  
  // Hooks
  const { 
    shorts, 
    currentVideoIndex, 
    setCurrentVideoIndex, 
    isLoading, 
    isError, 
    error,
    hasNextPage,
    handleRetryLoad, 
    refetch 
  } = useShortsFeed(specificShortId);
  
  useRealtimeShorts(refetch);
  
  const { handleView } = useTrackingAction();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const feedContainerRef = useRef<HTMLDivElement>(null);
  
  const { handleScroll, handleTouchStart, handleTouchEnd } = useShortNavigation({
    currentVideoIndex,
    setCurrentVideoIndex,
    totalShorts: shorts.length,
    setIsMuted
  });

  // Track view when current video changes
  useEffect(() => {
    if (shorts.length > 0 && currentVideoIndex >= 0 && currentVideoIndex < shorts.length) {
      const currentShort = shorts[currentVideoIndex];
      handleView(currentShort.id);
    }
  }, [currentVideoIndex, shorts, handleView]);

  const handleNextVideo = () => {
    if (currentVideoIndex < shorts.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  // Render states
  if (isError && !isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-luxury-darker">
        <ErrorState 
          title="Failed to load shorts" 
          description={error?.message || "We couldn't load videos. Please try again."} 
          onRetry={handleRetryLoad}
        />
      </div>
    );
  }

  if (!isLoading && shorts.length === 0) {
    return <EmptyShortsState />;
  }

  return (
    <div 
      className="fixed inset-0 bg-black"
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={feedContainerRef}
    >
      <div className="h-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden scrollbar-hide">
        <AnimatePresence initial={false}>
          {shorts.map((short, index) => (
            <ShortItem 
              key={short.id}
              short={short}
              isCurrentVideo={index === currentVideoIndex}
              index={index}
              currentVideoIndex={currentVideoIndex}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {!isMobile && (
        <ShortNavigationButtons 
          currentVideoIndex={currentVideoIndex}
          totalShorts={shorts.length}
          onNextClick={handleNextVideo}
          onPrevClick={handlePrevVideo}
        />
      )}

      {/* Loading indicators */}
      <ShortsLoadingIndicator isLoading={isLoading} type="fullscreen" />
      {hasNextPage && currentVideoIndex >= shorts.length - 2 && (
        <ShortsLoadingIndicator isLoading={true} type="more" />
      )}

      {/* Mobile swipe indicator */}
      {isMobile && shorts.length > 0 && (
        <div className="fixed top-1/2 right-4 -translate-y-1/2 z-30 flex flex-col gap-2 items-center">
          <div className="text-white/70 text-xs bg-black/30 rounded-full px-2 py-1 backdrop-blur-sm">
            Swipe to navigate
          </div>
        </div>
      )}
    </div>
  );
};
