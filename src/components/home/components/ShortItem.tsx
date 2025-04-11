import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { ShareDialog } from "@/components/feed/ShareDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CommentSection } from "@/components/feed/CommentSection";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { ShortContent } from "./ShortContent";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { Short } from "../types/short";
import { useShortActions } from "../hooks/actions";
import { useToast } from "@/hooks/use-toast";
import { getUrlWithCacheBuster } from "@/utils/mediaUtils";
import { getPlayableMediaUrl, addCacheBuster } from "@/utils/media/getPlayableMediaUrl";
import { debugMediaUrl } from "@/utils/media/debugMediaUtils";

interface ShortItemProps {
  short: Short;
  isCurrentVideo: boolean;
  index: number;
  currentVideoIndex: number;
}

export const ShortItem = ({ 
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
  const [videoError, setVideoError] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);
  const [isMediaAvailable, setIsMediaAvailable] = useState(true);
  
  // Hooks
  const { handleLike, handleSave, handleDelete, handleShare, handleShareTracking, handleView } = useShortActions();
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playCommentSound } = useSoundEffects();
  const { toast } = useToast();

  // Validate data for rendering
  const isValidShort = !!short && !!short.id;
  
  // Use our utility to get a playable URL
  const videoUrl = short?.video_urls?.length ? 
    getPlayableMediaUrl({ video_url: short.video_urls[0] }) : null;
  
  const hasThumbnail = !!short?.video_thumbnail_url;
  const thumbnailUrl = hasThumbnail ? 
    getPlayableMediaUrl({ media_url: short.video_thumbnail_url }) : undefined;
  
  // Check if media is available
  useEffect(() => {
    if (!videoUrl && !hasThumbnail) {
      console.warn("Short has no video or thumbnail:", short?.id);
      setIsMediaAvailable(false);
    } else {
      setIsMediaAvailable(true);
    }
  }, [short?.id, videoUrl, hasThumbnail]);

  // Add cache busting to URLs
  const videoUrlWithCacheBuster = videoUrl ? addCacheBuster(videoUrl) : null;
  const thumbnailUrlWithCacheBuster = thumbnailUrl ? addCacheBuster(thumbnailUrl) : undefined;
  
  // Reset video error state when short changes
  useEffect(() => {
    if (isValidShort) {
      setVideoError(false);
      setLoadRetries(0);
    }
  }, [short?.id, isValidShort]);

  // Track view when this becomes the current video
  useEffect(() => {
    const trackView = async () => {
      if (isCurrentVideo && !viewTracked && short?.id) {
        try {
          await handleView(short.id);
          setViewTracked(true);
          console.log(`View tracked for short: ${short.id}`);
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
  const handleShareClick = (shortId: string) => {
    if (!isValidShort) return;
    
    setIsShareOpen(true);
    // Track share action
    if (handleShareTracking) {
      handleShareTracking(shortId);
    }
  };

  const handleCommentClick = () => {
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
  };

  const handleLikeClick = async (shortId: string) => {
    if (!isValidShort) return;
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like shorts",
      });
      return;
    }
    
    await handleLike(shortId);
  };

  const handleSaveClick = async (shortId: string) => {
    if (!isValidShort) return;
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save shorts",
      });
      return;
    }
    
    await handleSave(shortId);
  };

  const handleDeleteClick = async (shortId: string) => {
    if (!isValidShort) return;
    
    if (!session || session.user.id !== short.creator_id) {
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
  };

  const handleVideoError = () => {
    console.error("Video error for short:", short?.id, videoUrl);
    
    // Debug the URL when error occurs
    if (videoUrlWithCacheBuster) {
      debugMediaUrl(videoUrlWithCacheBuster).then(result => {
        console.log("Short video URL debug result:", result);
      });
    }
    
    setVideoError(true);
    setLoadRetries(prev => prev + 1);
    
    if (loadRetries < 2) {
      // Try to reload the video after a short delay
      setTimeout(() => {
        setVideoError(false);
      }, 2000);
    } else {
      // After multiple retries, show a toast
      toast({
        title: "Video loading error",
        description: "Unable to load this video. You may want to try again later.",
        variant: "destructive"
      });
    }
  };

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
      
      {!isMediaAvailable ? (
        <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker">
          <p className="text-luxury-neutral/70">This video is not available</p>
        </div>
      ) : !videoUrlWithCacheBuster ? (
        <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker">
          <p className="text-luxury-neutral/70">This video is not available</p>
        </div>
      ) : (
        <VideoPlayer
          url={videoUrlWithCacheBuster}
          poster={thumbnailUrlWithCacheBuster}
          className="h-full w-full object-cover"
          autoPlay={index === currentVideoIndex}
          onError={handleVideoError}
          creatorId={short.creator_id}
        />
      )}
      
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
};
