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
import { ErosVideo } from "@/types/eros";

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
  
  const {
    comments,
    loading: commentsLoading,
    addComment,
    likeComment,
  } = useErosComments(selectedVideoId || '');
  
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || loading) return;
    
    const container = containerRef.current;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const scrollHeight = container.scrollHeight;
    
    if (scrollHeight - scrollPosition < 500) {
      loadMoreVideos();
    }
    
    const videoHeight = container.clientHeight;
    const newIndex = Math.round(container.scrollTop / videoHeight);
    
    if (newIndex !== currentIndex && videos[newIndex]) {
      setCurrentIndex(newIndex);
      
      const currentVideo = videos[newIndex];
      if (currentVideo?.id) {
        window.history.replaceState(null, '', `/eros/${currentVideo.id}`);
      }
    }
  }, [currentIndex, videos, hasMore, loading, loadMoreVideos, setCurrentIndex]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
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
  
  const handleShareClick = (id: string) => {
    setSelectedVideoId(id);
    setShareDialogOpen(true);
    
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
  
  const toggleAutoPlay = () => {
    setIsAutoPlayEnabled(!isAutoPlayEnabled);
    localStorage.setItem('eros-autoplay', (!isAutoPlayEnabled).toString());
  };
  
  useEffect(() => {
    const storedAutoPlay = localStorage.getItem('eros-autoplay');
    if (storedAutoPlay !== null) {
      setIsAutoPlayEnabled(storedAutoPlay === 'true');
    }
  }, []);

  const mappedVideos: ErosVideo[] = videos.map(video => ({
    id: video.id,
    url: video.video_url,
    thumbnailUrl: video.thumbnail_url || undefined,
    description: video.description || undefined,
    creator: {
      id: video.creator_id,
      name: video.creator?.username || 'Unknown',
      username: video.creator?.username || 'Unknown',
      avatarUrl: video.creator?.avatar_url || undefined,
    },
    stats: {
      likes: video.like_count,
      comments: video.comment_count,
      shares: video.share_count,
      views: video.view_count,
    },
    hasLiked: video.is_liked,
    hasSaved: video.is_saved,
    createdAt: video.created_at,
    duration: video.duration,
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      {loading && videos.length === 0 && (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-luxury-primary" />
        </div>
      )}
      
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
      
      <div 
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scrollbar-hide"
      >
        {mappedVideos.map((video, index) => (
          <ErosItem
            key={video.id}
            video={video}
            isActive={index === currentIndex}
            onLike={() => handleLike(video.id)}
            onComment={() => handleCommentClick(video.id)}
            onShare={() => handleShareClick(video.id)}
            onSave={() => handleSave(video.id)}
            autoPlay={isAutoPlayEnabled}
          />
        ))}
        
        {loading && videos.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
          </div>
        )}
        
        {!loading && !hasMore && videos.length > 0 && (
          <div className="flex items-center justify-center py-16 text-center px-4">
            <p className="text-gray-400">You've reached the end</p>
          </div>
        )}
      </div>
      
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

      <div className="fixed bottom-24 right-6 md:bottom-6 z-50">
        <UploadShortButton onUploadClick={handleUploadClick} />
      </div>
      
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
