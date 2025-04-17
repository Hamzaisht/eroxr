
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ErosItem } from "@/components/eros/ErosItem";
import { ErosCommentDialog } from "@/components/eros/ErosCommentDialog";
import { ErosShareDialog } from "@/components/eros/ErosShareDialog";
import { useErosFeed } from "@/hooks/useErosFeed";
import { useErosComments } from "@/hooks/useErosComments";
import { useMediaQuery } from "@/hooks/use-mobile";

export default function Eros() {
  const { videoId } = useParams<{ videoId?: string }>();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Get videos from our hook
  const {
    videos,
    currentIndex,
    setCurrentIndex,
    loading,
    error,
    hasMore,
    loadMoreVideos,
    handleLike,
    handleSave,
    handleShare,
    refreshVideos,
  } = useErosFeed({ initialVideoId: videoId });
  
  // Get comments for the currently selected video
  const {
    comments,
    loading: commentsLoading,
    addComment,
    likeComment,
  } = useErosComments(selectedVideoId || '');
  
  // Handle scroll to detect when we need to load more videos
  const handleScroll = () => {
    if (!containerRef.current || !hasMore) return;
    
    const container = containerRef.current;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const scrollHeight = container.scrollHeight;
    
    // If we're near the bottom, load more videos
    if (scrollHeight - scrollPosition < 500) {
      loadMoreVideos();
    }
    
    // Update current index based on scroll position
    const videoHeight = container.clientHeight;
    const newIndex = Math.round(container.scrollTop / videoHeight);
    
    if (newIndex !== currentIndex && videos[newIndex]) {
      setCurrentIndex(newIndex);
    }
  };
  
  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex, videos.length]);
  
  // Handle comment button click
  const handleCommentClick = (id: string) => {
    setSelectedVideoId(id);
    setCommentDialogOpen(true);
  };
  
  // Handle share button click
  const handleShareClick = (id: string) => {
    setSelectedVideoId(id);
    setShareDialogOpen(true);
    
    // Track share action
    handleShare(id);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Loading state */}
      {loading && videos.length === 0 && (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-luxury-primary" />
        </div>
      )}
      
      {/* Error state */}
      {error && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refreshVideos}
            className="px-4 py-2 bg-luxury-primary text-white rounded-md"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Videos feed */}
      <div 
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scrollbar-hide"
      >
        {videos.map((video, index) => (
          <ErosItem
            key={video.id}
            video={video}
            isActive={index === currentIndex}
            onLike={handleLike}
            onComment={handleCommentClick}
            onShare={handleShareClick}
            onSave={handleSave}
          />
        ))}
        
        {/* Loading more indicator */}
        {loading && videos.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
          </div>
        )}
        
        {/* End of feed */}
        {!loading && !hasMore && videos.length > 0 && (
          <div className="flex items-center justify-center py-16 text-center px-4">
            <p className="text-gray-400">You've reached the end</p>
          </div>
        )}
      </div>
      
      {/* Dialogs */}
      <ErosCommentDialog
        videoId={selectedVideoId || ''}
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        comments={comments}
        isLoading={commentsLoading}
        onAddComment={addComment}
        onLikeComment={likeComment}
      />
      
      <ErosShareDialog
        videoId={selectedVideoId || ''}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onShare={(platform) => {
          console.log(`Shared on ${platform}`);
        }}
      />
    </div>
  );
}
