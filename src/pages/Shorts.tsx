
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { ShortVideoPlayer } from "@/components/home/components/ShortVideoPlayer";
import { ShortActions } from "@/components/home/components/short/ShortActions";
import { ShortNavigationButtons } from "@/components/home/components/ShortNavigationButtons";
import { useShortNavigation } from "@/components/home/hooks/useShortNavigation";
import { useShortActions } from "@/components/home/hooks/actions/useShortActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CommentsModal } from "@/components/home/components/CommentsModal";

interface ShortVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  creator_id: string;
  like_count: number;
  view_count: number;
  share_count: number;
  comment_count: number;
  created_at: string;
  username: string;
  avatar_url?: string;
}

const Shorts = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { likeShort, unlikeShort, saveShort, unsaveShort } = useShortActions();

  const { data: shorts, isLoading, error, refetch } = useQuery({
    queryKey: ['shorts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          creator_id,
          like_count,
          view_count,
          share_count,
          comment_count,
          created_at,
          visibility,
          profiles!creator_id (
            username,
            avatar_url
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Transform the data to flatten the profiles relationship
      const transformedData = data?.map(video => ({
        ...video,
        username: (video.profiles as any)?.username || 'Unknown',
        avatar_url: (video.profiles as any)?.avatar_url,
        // Remove the profiles array since we've flattened it
        profiles: undefined
      }));

      return transformedData as ShortVideo[];
    }
  });

  const {
    handleScroll,
    handleTouchStart,
    handleTouchEnd
  } = useShortNavigation({
    currentVideoIndex,
    setCurrentVideoIndex,
    totalShorts: shorts?.length || 0,
    setIsMuted
  });

  const handleNext = () => {
    if (currentVideoIndex < (shorts?.length || 0) - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleLike = async (shortId: string) => {
    const success = await likeShort(shortId);
    if (success) {
      // Optimistically update the UI
      refetch();
      toast({
        title: "Liked! ❤️",
        description: "Video added to your likes",
      });
    }
  };

  const handleUnlike = async (shortId: string) => {
    const success = await unlikeShort(shortId);
    if (success) {
      refetch();
      toast({
        title: "Unliked",
        description: "Video removed from your likes",
      });
    }
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleShare = async (video: ShortVideo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
        toast({
          title: "Shared! 🚀",
          description: "Video shared successfully",
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Copied! 📋",
        description: "Link copied to clipboard",
      });
    }
  };

  const handleSave = async (shortId: string) => {
    const success = await saveShort(shortId);
    if (success) {
      refetch();
      toast({
        title: "Saved! 🔖",
        description: "Video saved to your collection",
      });
    }
  };

  const handleUnsave = async (shortId: string) => {
    const success = await unsaveShort(shortId);
    if (success) {
      refetch();
      toast({
        title: "Unsaved",
        description: "Video removed from your collection",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-luxury-primary mx-auto mb-4" />
          <p className="text-luxury-neutral">Loading shorts...</p>
        </div>
      </div>
    );
  }

  if (error || !shorts || shorts.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-luxury-neutral mb-4">No shorts available</p>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="border-luxury-primary text-luxury-primary hover:bg-luxury-primary hover:text-black"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentVideo = shorts[currentVideoIndex];

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden z-50"
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* Video Container */}
      <div className="relative w-full h-full">
        <ShortVideoPlayer
          videoUrl={currentVideo.video_url}
          thumbnailUrl={currentVideo.thumbnail_url}
          creatorId={currentVideo.creator_id}
          isCurrentVideo={true}
          onError={() => {
            toast({
              title: "Video Error",
              description: "Failed to load video",
              variant: "destructive",
            });
          }}
        />

        {/* Creator Info Overlay */}
        <div className="absolute bottom-0 left-0 right-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
          <div className="space-y-3">
            {/* Creator */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary shadow-lg shadow-primary/20">
                <AvatarImage src={currentVideo.avatar_url} />
                <AvatarFallback className="bg-primary text-black font-bold">
                  {currentVideo.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-white font-semibold text-lg">
                  @{currentVideo.username || 'Unknown'}
                </p>
                <p className="text-muted-foreground text-sm">
                  {currentVideo.view_count?.toLocaleString() || 0} views
                </p>
              </div>
              
              {/* Edit/Delete buttons for creator */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 bg-black/30"
                  onClick={() => {
                    // TODO: Navigate to edit page
                    toast({
                      title: "Edit Video",
                      description: "Edit functionality coming soon!",
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/20 bg-black/30"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this video?')) {
                      // TODO: Implement delete functionality
                      toast({
                        title: "Deleted",
                        description: "Video deleted successfully",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Description */}
            {currentVideo.description && (
              <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                {currentVideo.description}
              </p>
            )}

            {/* Timestamp */}
            <p className="text-luxury-neutral text-xs">
              {new Date(currentVideo.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute bottom-32 right-4 z-20">
          <ShortActions
            hasLiked={false} // TODO: Implement actual like state from database
            hasSaved={false} // TODO: Implement actual save state from database
            likesCount={currentVideo.like_count || 0}
            commentsCount={currentVideo.comment_count || 0}
            sharesCount={currentVideo.share_count || 0}
            onLike={() => handleLike(currentVideo.id)}
            onComment={handleComment}
            onShare={() => handleShare(currentVideo)}
            onSave={() => handleSave(currentVideo.id)}
            isDeleting={false}
          />
        </div>

        {/* Progress Indicator - minimal */}
        <div className="absolute top-16 right-4 z-20">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-white text-xs font-medium">
              {currentVideoIndex + 1}/{shorts.length}
            </span>
          </div>
        </div>

        {/* Cyberpunk Glow Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-luxury-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500" />
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        videoId={currentVideo.id}
        videoTitle={currentVideo.title}
      />
    </div>
  );
};

export default Shorts;
