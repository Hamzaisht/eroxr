import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ShareDialog } from "@/components/feed/ShareDialog";
import { Short } from "./types/short";
import { useShortActions } from "./hooks/useShortActions";
import { VideoPlayer } from "../video/VideoPlayer";
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
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/ErrorState";

export const ShortsFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const { handleLike, handleSave, handleDelete } = useShortActions();
  const session = useSession();
  const queryClient = useQueryClient();
  const { 
    data, 
    refetch, 
    fetchNextPage, 
    hasNextPage,
    isError,
    error 
  } = useFeedQuery(session?.user?.id, 'shorts');
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const { playLikeSound, playCommentSound } = useSoundEffects();
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);

  const shorts: Short[] = (data?.pages.flatMap(page => page) ?? []).map(post => ({
    id: post.id,
    creator: {
      username: post.creator?.username || 'Anonymous',
      avatar_url: post.creator?.avatar_url || null,
      id: post.creator_id
    },
    creator_id: post.creator_id,
    content: post.content,
    video_urls: post.video_urls,
    likes_count: post.likes_count,
    comments_count: post.comments_count,
    has_liked: post.has_liked,
    has_saved: post.has_saved || false,
    created_at: post.created_at
  }));

  useEffect(() => {
    if (data || isError) {
      setIsLoading(false);
    }
  }, [data, isError]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('public:video_posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `video_urls.neq.null`
        },
        (payload) => {
          console.log('Real-time post update:', payload);
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New short",
              description: "A new short has been posted!",
            });
            refetch();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient, toast, refetch]);

  useEffect(() => {
    if (!shorts[currentVideoIndex] || !session?.user?.id) return;
    
    const videoId = shorts[currentVideoIndex].id;
    
    const updateViewCount = async () => {
      try {
        const { error } = await supabase
          .from('posts')
          .update({ view_count: supabase.rpc('increment_counter', { row_id: videoId, counter_name: 'view_count' }) })
          .eq('id', videoId);
          
        if (error) console.error('Error updating view count:', error);
      } catch (err) {
        console.error('Failed to update view count:', err);
      }
    };
    
    updateViewCount();
    
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }, [currentVideoIndex, session?.user?.id, shorts, queryClient]);

  useEffect(() => {
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
    event.preventDefault();
    
    if (event.deltaY > 0 && currentVideoIndex < shorts.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else if (event.deltaY < 0 && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    
    if (deltaY > 50 && currentVideoIndex < shorts.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } 
    else if (deltaY < -50 && currentVideoIndex > 0) {
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

  useEffect(() => {
    if (currentVideoIndex >= shorts.length - 2 && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [currentVideoIndex, shorts.length, fetchNextPage, hasNextPage, isLoading]);

  const handleRetryLoad = () => {
    setIsLoading(true);
    refetch();
  };

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
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-luxury-darker text-white text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
          <p className="text-luxury-neutral mb-8">Be the first to upload a short video and start the trend!</p>
          
          {session?.user && (
            <Button 
              size="lg" 
              className="bg-luxury-primary hover:bg-luxury-primary/80"
              onClick={() => document.getElementById('upload-video-button')?.click()}
            >
              Upload Your First Short
            </Button>
          )}
        </motion.div>
      </div>
    );
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
                onDelete={
                  session?.user?.id === short.creator_id 
                    ? () => handleDelete(short.id) 
                    : undefined
                }
                isCurrentVideo={index === currentVideoIndex}
                className={`absolute bottom-0 left-0 right-0 z-20 p-4 ${isMobile ? 'pb-16' : 'p-6'}`}
              />
              
              {!isMobile && (
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
              )}
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

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-luxury-darker/80 rounded-lg p-6 backdrop-blur-lg flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-luxury-primary mb-2" />
            <p className="text-luxury-neutral">Loading videos...</p>
          </div>
        </div>
      )}

      {hasNextPage && currentVideoIndex >= shorts.length - 2 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-luxury-darker/80 rounded-full px-4 py-2 backdrop-blur-lg flex items-center">
            <Loader2 className="w-4 h-4 animate-spin text-luxury-primary mr-2" />
            <p className="text-luxury-neutral text-sm">Loading more videos...</p>
          </div>
        </div>
      )}

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
