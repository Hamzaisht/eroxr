
import { motion } from "framer-motion";
import { useState, useEffect, memo, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { ShareDialog } from "@/components/feed/ShareDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CommentSection } from "@/components/feed/CommentSection";
import { ShortContent } from "./ShortContent";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { Short } from "../types/short";
import { useShortActions } from "../hooks/actions";
import { useToast } from "@/hooks/use-toast";
import { ShortVideoPlayer } from "./ShortVideoPlayer";

interface ShortItemProps {
  short: Short;
  isCurrentVideo: boolean;
  index: number;
  currentVideoIndex: number;
}

export const ShortItem = memo(({ 
  short, 
  isCurrentVideo, 
  index, 
  currentVideoIndex 
}: ShortItemProps) => {
  // State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Hooks
  const { handleLike, handleSave, handleDelete, handleShare, handleShareTracking, handleView } = useShortActions();
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playCommentSound } = useSoundEffects();
  const { toast } = useToast();

  // Validate data for rendering
  const isValidShort = !!short && !!short.id;
  
  // Track view when this becomes the current video
  useEffect(() => {
    const trackView = async () => {
      if (isCurrentVideo && !viewTracked && short?.id) {
        try {
          await handleView(short.id);
          setViewTracked(true);
        } catch (error) {
          console.error("Failed to track view:", error);
        }
      }
    };

    if (isCurrentVideo && isValidShort) {
      trackView();
    }
  }, [isCurrentVideo, viewTracked, short?.id, handleView, isValidShort]);

  // Reset view tracking when short changes
  useEffect(() => {
    if (isValidShort) {
      setViewTracked(false);
    }
  }, [short?.id, isValidShort]);

  // Handlers
  const handleShareClick = useCallback((shortId: string) => {
    if (!isValidShort) return;
    
    setIsShareOpen(true);
    if (handleShareTracking) {
      handleShareTracking(shortId);
    }
  }, [isValidShort, handleShareTracking]);

  const handleCommentClick = useCallback(() => {
    if (!isValidShort) return;
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment on shorts",
      });
      return;
    }
    
    setIsCommentsOpen(true);
    playCommentSound();
  }, [isValidShort, session, toast, playCommentSound]);

  const handleLikeClick = useCallback(async (shortId: string) => {
    if (!isValidShort) return;
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like shorts",
      });
      return;
    }
    
    await handleLike(shortId);
  }, [isValidShort, session, toast, handleLike]);

  const handleSaveClick = useCallback(async (shortId: string) => {
    if (!isValidShort) return;
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save shorts",
      });
      return;
    }
    
    await handleSave(shortId);
  }, [isValidShort, session, toast, handleSave]);

  const handleDeleteClick = useCallback(async (shortId: string) => {
    if (!isValidShort || !session || session.user.id !== short.creator_id) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await handleDelete(shortId);
      toast({
        title: "Short deleted",
        description: "Your short has been successfully deleted",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "An error occurred while deleting your short",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [isValidShort, session, short?.creator_id, handleDelete, toast]);

  const handleVideoError = useCallback(() => {
    console.error("Video playback error in ShortItem");
  }, []);

  // If no valid short data, show a placeholder
  if (!isValidShort) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative h-[100dvh] w-full snap-start snap-always flex items-center justify-center bg-luxury-darker"
      >
        <div className="text-center p-4">
          <p className="text-luxury-neutral/70">This content is not available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={short.id}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        scale: isCurrentVideo ? 1 : 0.95
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative h-[100dvh] w-full snap-start snap-always"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
      
      <ShortVideoPlayer
        videoUrl={short.video_urls?.length ? short.video_urls[0] : null}
        thumbnailUrl={short.video_thumbnail_url}
        creatorId={short.creator_id}
        isCurrentVideo={index === currentVideoIndex}
        isDeleting={isDeleting}
        onError={handleVideoError}
      />
      
      <ShortContent
        short={{
          ...short,
          description: short.content || '',
          likes: short.likes_count || 0,
          comments: short.comments_count || 0,
          view_count: short.view_count || 0
        }}
        onShare={handleShareClick}
        onComment={handleCommentClick}
        handleLike={handleLikeClick}
        handleSave={handleSaveClick}
        onDelete={
          session?.user?.id === short.creator_id 
            ? () => handleDeleteClick(short.id) 
            : undefined
        }
        isDeleting={isDeleting}
        isCurrentVideo={isCurrentVideo}
        className={`absolute bottom-0 left-0 right-0 z-20 p-4 ${isMobile ? 'pb-16' : 'p-6'}`}
      />

      {/* Dialogs */}
      {isValidShort && (
        <>
          <ShareDialog
            open={isShareOpen}
            onOpenChange={setIsShareOpen}
            postId={short.id}
          />
          
          <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
            <DialogContent className={`${isMobile ? 'w-full h-[80dvh] rounded-t-xl mt-auto' : 'sm:max-w-[425px] h-[80vh]'} bg-black/95`}>
              <CommentSection
                postId={short.id}
                commentsCount={short.comments_count ?? 0}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </motion.div>
  );
});

ShortItem.displayName = "ShortItem";
