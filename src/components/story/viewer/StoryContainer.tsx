
import { useEffect } from "react";
import { motion } from "framer-motion";
import { StoryControls } from "./StoryControls";
import { StoryContent } from "./StoryContent";
import { NavigationButtons } from "./NavigationButtons";
import { StoryProgress } from "./StoryProgress";
import { StoryHeader } from "./StoryHeader";
import { Story } from "@/integrations/supabase/types/story";
import { useMediaQuery } from "@/hooks/use-mobile";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Camera, Eye, Share2, MoreVertical, Trash2, Edit, Users, Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { initializeScreenshotProtection } from "@/lib/security";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";

interface StoryContainerProps {
  stories: Story[];
  currentStory: Story;
  currentIndex: number;
  progress: number;
  isPaused: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPause: () => void;
  onResume: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  timeRemaining: string;
}

interface ViewerStats {
  views: number;
  screenshots: number;
  shares: number;
  likes: number;
}

export const StoryContainer = ({
  stories,
  currentStory,
  currentIndex,
  progress,
  isPaused,
  onClose,
  onNext,
  onPrevious,
  onPause,
  onResume,
  onDelete,
  onEdit,
  timeRemaining,
}: StoryContainerProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const session = useSession();
  const [viewerStats, setViewerStats] = useState<ViewerStats>({ 
    views: 41300,  // Demo numbers matching the image
    screenshots: 287,
    shares: 1924,
    likes: 4597
  });
  const [showViewers, setShowViewers] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      initializeScreenshotProtection(session.user.id, currentStory.creator_id);
    }
  }, [session?.user?.id, currentStory.creator_id]);

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 3) {
      onPrevious();
    } else if (x > (width * 2) / 3) {
      onNext();
    }
  };

  const isOwner = session?.user?.id === currentStory.creator_id;

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full h-full">
        <StoryProgress
          stories={stories}
          currentIndex={currentIndex}
          progress={progress}
          isPaused={isPaused}
        />

        <div className="absolute top-0 left-0 right-0 z-20 p-4">
          <StoryHeader
            creator={currentStory.creator}
            timeRemaining={timeRemaining}
            onClose={onClose}
          />
        </div>

        <StoryContent 
          story={currentStory}
          onNext={onNext}
          isPaused={isPaused}
        />

        <StoryControls
          onClick={handleContentClick}
          onMouseDown={onPause}
          onMouseUp={onResume}
          onMouseLeave={onResume}
          onTouchStart={onPause}
          onTouchEnd={onResume}
        />

        {/* Right side buttons - TikTok style */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-30">
          <div className="flex flex-col items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
            >
              <Heart className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs">{viewerStats.likes}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
              onClick={() => setShowViewers(true)}
            >
              <Eye className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs">{viewerStats.views}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs">{viewerStats.screenshots}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
            >
              <Share2 className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs">{viewerStats.shares}</span>
          </div>

          {isOwner && (
            <div className="flex flex-col items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
                  >
                    <MoreVertical className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Story
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Story
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {!isMobile && (
          <NavigationButtons
            currentIndex={currentIndex}
            totalStories={stories.length}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        )}

        <Sheet open={showViewers} onOpenChange={setShowViewers}>
          <SheetContent side="bottom" className="h-[50vh]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Story Viewers
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {/* Viewers list would go here */}
              <div className="text-sm text-gray-500">
                Coming soon: Detailed viewer analytics
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
