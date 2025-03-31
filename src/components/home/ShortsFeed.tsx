
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { ShareDialog } from "@/components/feed/ShareDialog";
import { useShortActions } from "./hooks/useShortActions";
import { VideoPlayer } from "../video/VideoPlayer";
import { ShortContent } from "./components/ShortContent";
import { useSession } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CommentSection } from "../feed/CommentSection";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { ErrorState } from "@/components/ui/ErrorState";
import { useShortsFeed } from "./hooks/useShortsFeed";
import { useRealtimeShorts } from "./hooks/useRealtimeShorts";
import { useShortNavigation } from "./hooks/useShortNavigation";
import { ShortsLoadingIndicator } from "./components/ShortsLoadingIndicator";
import { ShortNavigationButtons } from "./components/ShortNavigationButtons";
import { EmptyShortsState } from "./components/EmptyShortsState";

interface ShortsFeedProps {
  specificShortId?: string | null;
}

export const ShortsFeed = ({ specificShortId }: ShortsFeedProps) => {
  // State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
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
  
  const { handleLike, handleSave, handleDelete } = useShortActions();
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playCommentSound } = useSoundEffects();
  const feedContainerRef = useRef<HTMLDivElement>(null);
  
  const { handleScroll, handleTouchStart, handleTouchEnd } = useShortNavigation({
    currentVideoIndex,
    setCurrentVideoIndex,
    totalShorts: shorts.length,
    setIsMuted
  });

  // Actions
  const handleShare = (shortId: string) => {
    setSelectedShortId(shortId);
    setIsShareOpen(true);
  };

  const handleCommentClick = (shortId: string) => {
    setSelectedShortId(shortId);
    setIsCommentsOpen(true);
    playCommentSound();
  };

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
            <motion.div
              key={short.id}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                scale: index === currentVideoIndex ? 1 : 0.95
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-[100dvh] w-full snap-start snap-always"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
              <VideoPlayer
                url={short.video_urls?.[0] ?? ""}
                poster={`${short.video_urls?.[0]?.split('.').slice(0, -1).join('.')}.jpg`}
                className="h-full w-full object-cover"
                autoPlay={index === currentVideoIndex}
                onError={() => console.error(`Failed to load video: ${short.id}`)}
              />
              <ShortContent
                short={{
                  ...short,
                  description: short.content,
                  likes: short.likes_count || 0,
                  comments: short.comments_count || 0
                }}
                onShare={handleShare}
                onComment={() => handleCommentClick(short.id)}
                handleLike={handleLike}
                handleSave={handleSave}
                onDelete={
                  session?.user?.id === short.creator_id 
                    ? () => handleDelete(short.id) 
                    : undefined
                }
                isCurrentVideo={index === currentVideoIndex}
                className={`absolute bottom-0 left-0 right-0 z-20 p-4 ${isMobile ? 'pb-16' : 'p-6'}`}
              />
              
              {/* Navigation buttons */}
              {!isMobile && (
                <ShortNavigationButtons 
                  currentVideoIndex={currentVideoIndex}
                  totalShorts={shorts.length}
                  onNextClick={handleNextVideo}
                  onPrevClick={handlePrevVideo}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dialogs */}
      {selectedShortId && (
        <>
          <ShareDialog
            open={isShareOpen}
            onOpenChange={setIsShareOpen}
            postId={selectedShortId}
          />
          
          <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
            <DialogContent className={`${isMobile ? 'w-full h-[80dvh] rounded-t-xl mt-auto' : 'sm:max-w-[425px] h-[80vh]'} bg-black/95`}>
              <CommentSection
                postId={selectedShortId}
                commentsCount={shorts.find(s => s.id === selectedShortId)?.comments_count ?? 0}
              />
            </DialogContent>
          </Dialog>
        </>
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
