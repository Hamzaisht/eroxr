
import { useState, useEffect } from "react";
import { InteractiveNav } from "@/components/layout/InteractiveNav";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePlatformSubscription } from "@/hooks/usePlatformSubscription";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { user } = useCurrentUser();
  const { hasPremium } = usePlatformSubscription();
  const { isSuperAdmin } = useUserRole();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [userInteractions, setUserInteractions] = useState<Record<string, { hasLiked: boolean; hasSaved: boolean }>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const { likeShort, unlikeShort, saveShort, unsaveShort, deleteShort, shareShort, checkUserInteractions } = useShortActions();

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
      
      console.log('Shorts - Raw data from database:', data);
      
      // Transform the data to flatten the profiles relationship
      const transformedData = data?.map(video => ({
        ...video,
        username: (video.profiles as any)?.username || 'Unknown',
        avatar_url: (video.profiles as any)?.avatar_url,
        // Remove the profiles array since we've flattened it
        profiles: undefined
      }));

      console.log('Shorts - Transformed data:', transformedData);
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

  // Define variables early but safely - Super admins and premium users have full access
  const hasFullAccess = hasPremium || isSuperAdmin;
  const currentVideo = shorts?.[currentVideoIndex];
  const isCreator = authUser?.id === currentVideo?.creator_id;

  // Load user interactions when video changes - ensure hooks are called consistently
  useEffect(() => {
    if (currentVideo && !userInteractions[currentVideo.id]) {
      checkUserInteractions(currentVideo.id).then(interactions => {
        setUserInteractions(prev => ({
          ...prev,
          [currentVideo.id]: interactions
        }));
      });
    }
  }, [currentVideo, checkUserInteractions, userInteractions]);

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
    const interactions = userInteractions[shortId];
    if (interactions?.hasLiked) {
      const success = await unlikeShort(shortId);
      if (success) {
        setUserInteractions(prev => ({
          ...prev,
          [shortId]: { hasLiked: false, hasSaved: userInteractions[shortId]?.hasSaved || false }
        }));
        refetch();
        toast({
          title: "Unliked",
          description: "Video removed from your likes",
        });
      }
    } else {
      const success = await likeShort(shortId);
      if (success) {
        setUserInteractions(prev => ({
          ...prev,
          [shortId]: { hasLiked: true, hasSaved: userInteractions[shortId]?.hasSaved || false }
        }));
        refetch();
        toast({
          title: "Liked! ❤️",
          description: "Video added to your likes",
        });
      }
    }
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleShare = async (video: ShortVideo) => {
    const success = await shareShort(video);
    if (success) {
      refetch();
    }
  };

  const handleSave = async (shortId: string) => {
    const interactions = userInteractions[shortId];
    if (interactions?.hasSaved) {
      const success = await unsaveShort(shortId);
      if (success) {
        setUserInteractions(prev => ({
          ...prev,
          [shortId]: { hasLiked: userInteractions[shortId]?.hasLiked || false, hasSaved: false }
        }));
        toast({
          title: "Unsaved",
          description: "Video removed from your collection",
        });
      }
    } else {
      const success = await saveShort(shortId);
      if (success) {
        setUserInteractions(prev => ({
          ...prev,
          [shortId]: { hasLiked: userInteractions[shortId]?.hasLiked || false, hasSaved: true }
        }));
        toast({
          title: "Saved! 🔖",
          description: "Video saved to your collection",
        });
      }
    }
  };

  const handleProfileClick = (creatorId: string) => {
    navigate(`/profile/${creatorId}`);
  };

  const handleEdit = () => {
    if (!currentVideo) return;
    navigate(`/shorts/${currentVideo.id}/edit`);
  };

  const handleDelete = async () => {
    if (!currentVideo) return;
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      const success = await deleteShort(currentVideo.id);
      if (success) {
        toast({
          title: "Deleted",
          description: "Video deleted successfully",
          variant: "destructive",
        });
        // Navigate away or refresh data
        if (shorts && shorts.length > 1) {
          refetch();
        } else {
          navigate('/');
        }
      }
    }
  };

  // Handle all early returns AFTER all hooks
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

  if (!currentVideo) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-luxury-neutral mb-4">No video available</p>
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

  return (
    <>
      {/* Hide navigation on mobile for full-screen experience */}
      <div className="hidden md:block">
        <InteractiveNav />
      </div>
      
      {/* Mobile-First Container */}
      <div 
        className="fixed inset-0 bg-black overflow-hidden z-50 md:ml-20"
        onWheel={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full Screen Video Container */}
        <div className="relative w-full h-full h-screen">
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

          {/* Mobile Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Top Status Bar Safe Area */}
          <div className="absolute top-0 left-0 right-0 h-safe-area-inset-top bg-black/20 md:hidden" />

          {/* Progress Indicator - Top Right */}
          <div className="absolute top-4 right-4 z-30 safe-area-padding-top">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
              <span className="text-white text-xs font-medium">
                {currentVideoIndex + 1}/{shorts.length}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-16 h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentVideoIndex + 1) / shorts.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Creator Info - Bottom Left */}
          <div className="absolute bottom-0 left-0 right-20 bg-gradient-to-t from-black/90 to-transparent p-4 safe-area-padding-bottom">
            <div className="space-y-3">
              {/* Creator Profile */}
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:scale-105"
                  onClick={() => handleProfileClick(currentVideo.creator_id)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-white/30 shadow-xl">
                      <AvatarImage src={currentVideo.avatar_url} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-black font-bold">
                        {currentVideo.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-base transition-colors group-hover:text-primary truncate">
                      @{currentVideo.username || 'Unknown'}
                    </p>
                    <p className="text-white/70 text-sm">
                      {currentVideo.view_count?.toLocaleString() || 0} views
                    </p>
                  </div>
                </div>
                
                {/* Creator Actions Menu */}
                {isCreator && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
                      >
                        <MoreHorizontal className="h-5 w-5 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="bg-black/90 backdrop-blur-md border-white/20 text-white min-w-[160px]"
                    >
                      <DropdownMenuItem 
                        onClick={handleEdit}
                        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Video
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleDelete}
                        className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Video
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Description */}
              {currentVideo.description && (
                <p className="text-white/90 text-sm leading-relaxed line-clamp-3 max-w-[280px]">
                  {currentVideo.description}
                </p>
              )}

              {/* Hashtags */}
              <div className="flex flex-wrap gap-2">
                <span className="text-primary text-sm font-medium hover:text-primary/80 cursor-pointer transition-colors">
                  #shorts
                </span>
                <span className="text-primary text-sm font-medium hover:text-primary/80 cursor-pointer transition-colors">
                  #viral
                </span>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span>{currentVideo.like_count?.toLocaleString() || 0} likes</span>
                <span>{new Date(currentVideo.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Actions - Right Side */}
          <div className="absolute bottom-24 right-3 z-30 safe-area-padding-bottom">
            <ShortActions
              hasLiked={userInteractions[currentVideo.id]?.hasLiked || false}
              hasSaved={userInteractions[currentVideo.id]?.hasSaved || false}
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

          {/* Mobile Navigation Helper (Invisible touch areas) */}
          <div className="md:hidden absolute inset-0 z-10 pointer-events-none">
            {/* Top half - Previous video */}
            <div 
              className="absolute top-0 left-0 right-0 h-1/2 pointer-events-auto"
              onClick={handlePrev}
            />
            {/* Bottom half - Next video */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-auto"
              onClick={handleNext}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ShortNavigationButtons
              currentVideoIndex={currentVideoIndex}
              totalShorts={shorts.length}
              onNextClick={handleNext}
              onPrevClick={handlePrev}
            />
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
    </>
  );
};

export default Shorts;
