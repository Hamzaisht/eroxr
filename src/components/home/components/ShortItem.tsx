
import { motion } from "framer-motion";
import { useState } from "react";
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
  
  // Hooks
  const { handleLike, handleSave, handleDelete, handleShare, handleShareTracking } = useShortActions();
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playCommentSound } = useSoundEffects();

  // Handlers
  const handleShareClick = (shortId: string) => {
    setIsShareOpen(true);
    // Track share action
    if (handleShareTracking) {
      handleShareTracking(shortId);
    }
  };

  const handleCommentClick = () => {
    setIsCommentsOpen(true);
    playCommentSound();
  };

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
        onShare={handleShareClick}
        onComment={() => handleCommentClick()}
        handleLike={handleLike}
        handleSave={handleSave}
        onDelete={
          session?.user?.id === short.creator_id 
            ? () => handleDelete(short.id) 
            : undefined
        }
        isCurrentVideo={isCurrentVideo}
        className={`absolute bottom-0 left-0 right-0 z-20 p-4 ${isMobile ? 'pb-16' : 'p-6'}`}
      />

      {/* Dialogs */}
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
    </motion.div>
  );
};
