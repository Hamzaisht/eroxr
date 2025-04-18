
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, RefreshCcw } from "lucide-react";
import { ErosItem } from "@/components/eros/ErosItem";
import { ErosCommentDialog } from "@/components/eros/ErosCommentDialog";
import { ErosShareDialog } from "@/components/eros/ErosShareDialog";
import { useErosFeed } from "@/hooks/useErosFeed";
import { useErosComments } from "@/hooks/useErosComments";
import { useMediaQuery } from "@/hooks/use-mobile";
import { UploadShortButton } from "@/components/home/UploadShortButton";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export default function Eros() {
  const { videoId } = useParams<{ videoId?: string }>();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  
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
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || loading) return;
    
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
      
      // Update URL without page reload
      const currentVideo = videos[newIndex];
      if (currentVideo?.id) {
        window.history.replaceState(null, '', `/eros/${currentVideo.id}`);
      }
    }
  }, [currentIndex, videos, hasMore, loading, loadMoreVideos, setCurrentIndex]);
  
  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  // Handle comment button click
  const handleCommentClick = (id: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on videos",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/eros/${id}` } });
      return;
    }
    
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

  const handleUploadClick = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload videos",
        variant: "destructive"
      });
      navigate('/login', { state: { from: '/eros' } });
      return;
    }
    
    navigate("/eros/upload");
  };
  
  // Toggle autoplay
  const toggleAutoPlay = () => {
    setIsAutoPlayEnabled(!isAutoPlayEnabled);
    localStorage.setItem('eros-autoplay', (!isAutoPlayEnabled).toString());
  };
  
  // Load autoplay preference from localStorage
  useEffect(() => {
    const storedAutoPlay = localStorage.getItem('eros-autoplay');
    if (storedAutoPlay !== null) {
      setIsAutoPlayEnabled(storedAutoPlay === 'true');
    }
  }, []);

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
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-500 mb-4 text-center">{error}</p>
          <button
            onClick={refreshVideos}
            className="px-4 py-2 bg-luxury-primary text-white rounded-md flex items-center"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
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
            autoPlay={isAutoPlayEnabled}
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

      {/* Upload button */}
      <div className="fixed bottom-24 right-6 md:bottom-6 z-50">
        <UploadShortButton onClick={handleUploadClick} />
      </div>
      
      {/* AutoPlay toggle */}
      <div className="fixed bottom-24 left-6 md:bottom-6 z-50">
        <button 
          onClick={toggleAutoPlay}
          className={`p-2 rounded-full ${
            isAutoPlayEnabled ? 'bg-luxury-primary' : 'bg-gray-600'
          }`}
        >
          {isAutoPlayEnabled ? 'Auto On' : 'Auto Off'}
        </button>
      </div>
    </div>
  );
}
