import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useShortsPagination } from "@/hooks/useShortsPagination";
import { ShortsLoadingIndicator } from "./components/ShortsLoadingIndicator";
import { ShortNavigationButtons } from "./components/ShortNavigationButtons";
import { EmptyShortsState } from "./components/EmptyShortsState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useMediaQuery } from "@/hooks/use-mobile";
import { ShortItem } from "./components/ShortItem";
import { UploadShortButton } from "./UploadShortButton";

interface ShortsFeedProps {
  specificShortId?: string | null;
}

export const ShortsFeed = ({ specificShortId }: ShortsFeedProps) => {
  // State
  const [isMuted, setIsMuted] = useState(true);
  
  // Hooks
  const { 
    shorts, 
    currentIndex, 
    setCurrentIndex, 
    isLoading, 
    error,
    hasMore,
    loadMore,
    refresh,
    handleLike,
    handleSave,
    handleShare
  } = useShortsPagination({
    initialShortId: specificShortId,
    pageSize: 5
  });
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const feedContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll navigation
  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0 && currentIndex < shorts.length - 1) {
      // Scrolling down
      setCurrentIndex(currentIndex + 1);
    } else if (event.deltaY < 0 && currentIndex > 0) {
      // Scrolling up
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  // Handle touch navigation for mobile
  const [touchStart, setTouchStart] = useState(0);
  
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(event.touches[0].clientY);
  };
  
  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchEnd = event.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    
    if (diff > 50 && currentIndex < shorts.length - 1) {
      // Swipe up
      setCurrentIndex(currentIndex + 1);
    } else if (diff < -50 && currentIndex > 0) {
      // Swipe down
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  // Scroll to current video when index changes
  useEffect(() => {
    if (feedContainerRef.current && shorts.length > 0) {
      const container = feedContainerRef.current;
      const videoHeight = container.clientHeight;
      container.scrollTo({
        top: currentIndex * videoHeight,
        behavior: 'smooth'
      });
      
      // Load more videos when approaching the end
      if (currentIndex >= shorts.length - 2 && !isLoading && hasMore) {
        loadMore();
      }
    }
  }, [currentIndex, shorts.length, isLoading, hasMore, loadMore]);
  
  // Handle manual navigation
  const handleNextVideo = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Render initial loading state
  if (isLoading && shorts.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <ShortsLoadingIndicator isLoading={true} type="fullscreen" />
      </div>
    );
  }

  // Render error state
  if (error && shorts.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <ErrorState 
          title="Failed to load videos" 
          description={error || "We couldn't load videos. Please try again."} 
          onRetry={refresh}
        />
      </div>
    );
  }

  // Render empty state
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
              short={{
                id: short.id,
                creator: {
                  username: short.creator.username,
                  avatar_url: short.creator.avatarUrl,
                  id: short.creator.id
                },
                creator_id: short.creator.id,
                content: short.description || "",
                description: short.description || "",
                video_urls: [short.url],
                video_thumbnail_url: short.thumbnailUrl,
                likes_count: short.stats.likes,
                comments_count: short.stats.comments,
                view_count: short.stats.views,
                has_liked: short.hasLiked,
                has_saved: short.hasSaved,
                created_at: short.createdAt,
                visibility: 'public'
              }}
              isCurrentVideo={index === currentIndex}
              index={index}
              currentVideoIndex={currentIndex}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {!isMobile && shorts.length > 0 && (
        <ShortNavigationButtons 
          currentVideoIndex={currentIndex}
          totalShorts={shorts.length}
          onNextClick={handleNextVideo}
          onPrevClick={handlePrevVideo}
        />
      )}

      {/* Loading indicators */}
      {isLoading && shorts.length > 0 && (
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

      {/* Add the upload button component */}
      <UploadShortButton />
    </div>
  );
};
