
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ShareDialog } from "@/components/feed/ShareDialog";
import { Short } from "./types/short";
import { useShortActions } from "./hooks/useShortActions";
import { VideoPlayer } from "./components/VideoPlayer";
import { ShortContent } from "./components/ShortContent";
import { useSession } from "@supabase/auth-helpers-react";
import { useFeedQuery } from "../feed/useFeedQuery";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CommentSection } from "../feed/CommentSection";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { useSoundEffects } from "@/hooks/use-sound-effects";

export const ShortsFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const { handleLike, handleSave } = useShortActions();
  const session = useSession();
  const { data, refetch, fetchNextPage, hasNextPage } = useFeedQuery(session?.user?.id, 'shorts');
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const { playLikeSound, playCommentSound } = useSoundEffects();
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Transform posts data into shorts format
  const shorts: Short[] = (data?.pages.flatMap(page => page) ?? []).map(post => ({
    id: post.id,
    creator: {
      username: post.creator?.username || 'Anonymous',
      avatar_url: post.creator?.avatar_url || null
    },
    content: post.content,
    video_urls: post.video_urls,
    likes_count: post.likes_count,
    comments_count: post.comments_count,
    has_liked: post.has_liked,
    has_saved: false // Default value since we don't have this in the post type
  }));

  useEffect(() => {
    // Subscribe to real-time updates for comments
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('public:comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          console.log('New comment:', payload);
          refetch();
          
          toast({
            title: "New comment",
            description: "Someone commented on a short",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, refetch, toast]);

  const handleShare = (shortId: string) => {
    setSelectedShortId(shortId);
    setIsShareOpen(true);
  };

  const handleCommentClick = (shortId: string) => {
    setSelectedShortId(shortId);
    setIsCommentsOpen(true);
    playCommentSound();
  };

  const handleScroll = (event: React.WheelEvent) => {
    if (event.deltaY > 0 && currentVideoIndex < shorts.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else if (event.deltaY < 0 && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    } else if (event.key === 'ArrowDown' && currentVideoIndex < shorts.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else if (event.key === 'm') {
      setIsMuted(prev => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, shorts.length]);

  return (
    <div 
      className="fixed inset-0 bg-black"
      onWheel={handleScroll}
      ref={feedContainerRef}
    >
      <div className="h-full snap-y snap-mandatory overflow-y-auto scrollbar-hide">
        <AnimatePresence initial={false}>
          {shorts.map((short, index) => (
            <motion.div
              key={short.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-[100dvh] w-full snap-start snap-always"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
              <VideoPlayer
                url={short.video_urls?.[0] ?? ""}
                index={index}
                isMuted={isMuted}
                onMuteChange={setIsMuted}
                isCurrentVideo={index === currentVideoIndex}
                onIndexChange={setCurrentVideoIndex}
                className="h-full w-full object-cover"
                onError={() => {
                  toast({
                    title: "Video Error",
                    description: "Failed to load video. Please try again.",
                    variant: "destructive",
                  });
                }}
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
                isCurrentVideo={index === currentVideoIndex}
                className={`absolute bottom-0 left-0 right-0 z-20 p-4 ${isMobile ? 'pb-16' : 'p-6'}`}
              />
              
              {/* Navigation buttons */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
                <button
                  onClick={() => currentVideoIndex > 0 && setCurrentVideoIndex(prev => prev - 1)}
                  className={`p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors
                    ${currentVideoIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentVideoIndex === 0}
                >
                  <ChevronUp className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => currentVideoIndex < shorts.length - 1 && setCurrentVideoIndex(prev => prev + 1)}
                  className={`p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors
                    ${currentVideoIndex === shorts.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentVideoIndex === shorts.length - 1}
                >
                  <ChevronDown className="w-6 h-6 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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

      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <Loader2 className="w-8 h-8 animate-spin text-luxury-primary" />
        </div>
      )}
    </div>
  );
};
