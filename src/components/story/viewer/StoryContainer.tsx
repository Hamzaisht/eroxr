
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
import { Camera, Eye, Share2, MoreVertical, Trash2, Edit, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  const [viewerStats, setViewerStats] = useState<ViewerStats>({ views: 0, screenshots: 0, shares: 0 });
  const [showViewers, setShowViewers] = useState(false);

  useEffect(() => {
    // Initialize screenshot protection
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
      <div className="relative w-full h-full md:w-[400px] md:h-[90vh]">
        <StoryProgress
          stories={stories}
          currentIndex={currentIndex}
          progress={progress}
          isPaused={isPaused}
        />

        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
          <StoryHeader
            creator={currentStory.creator}
            timeRemaining={timeRemaining}
            onClose={onClose}
          />

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setShowViewers(true)}
            >
              <Eye className="w-5 h-5" />
              <span className="ml-2 text-sm">{viewerStats.views}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Camera className="w-5 h-5" />
              <span className="ml-2 text-sm">{viewerStats.screenshots}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Share2 className="w-5 h-5" />
              <span className="ml-2 text-sm">{viewerStats.shares}</span>
            </Button>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <MoreVertical className="w-5 h-5" />
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
            )}
          </div>
        </div>

        <StoryControls
          onClick={handleContentClick}
          onMouseDown={onPause}
          onMouseUp={onResume}
          onMouseLeave={onResume}
          onTouchStart={onPause}
          onTouchEnd={onResume}
        />

        <StoryContent 
          story={currentStory}
          onNext={onNext}
          isPaused={isPaused}
        />

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
