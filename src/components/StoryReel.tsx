
import { useRef, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { supabase } from "@/integrations/supabase/client";
import { StoryUploader } from "./story/StoryUploader";
import { StoryItem } from "./story/StoryItem";
import { StoryViewer } from "./story/StoryViewer";
import { StoryNavigation } from "./story/StoryNavigation";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useStories } from "./story/hooks/useStories";
import { StoryLoadingState } from "./story/components/StoryLoadingState";
import { StoryErrorState } from "./story/components/StoryErrorState";
import { StoryReelHeader } from "./story/components/StoryReelHeader";

interface GroupedStories {
  [creatorId: string]: Story[];
}

export const StoryReel = () => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { stories, isLoading, error, setStories } = useStories();

  const handleDeleteStory = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;

      setStories(prev => prev.filter(story => story.id !== storyId));
      toast({
        title: "Story deleted",
        description: "Your story has been removed successfully",
      });
    } catch (err) {
      console.error('Error deleting story:', err);
      toast({
        title: "Error",
        description: "Failed to delete story",
        variant: "destructive",
      });
    }
  };

  const groupStoriesByCreator = (stories: Story[]): GroupedStories => {
    return stories.reduce((acc: GroupedStories, story) => {
      if (!acc[story.creator_id]) {
        acc[story.creator_id] = [];
      }
      acc[story.creator_id].push(story);
      return acc;
    }, {});
  };

  const groupedStories = groupStoriesByCreator(stories);

  if (isLoading) return <StoryLoadingState />;
  if (error) return <StoryErrorState error={error} />;

  return (
    <div className="w-full mx-auto px-0 sm:px-2 md:px-4 py-3">
      <div className="relative bg-gradient-to-r from-luxury-dark/60 via-luxury-darker/40 to-luxury-dark/60 backdrop-blur-xl rounded-xl p-4 shadow-xl">
        <StoryReelHeader />
        
        <div className="relative">
          <div
            ref={containerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide relative py-2 px-2"
          >
            {session && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="shrink-0"
              >
                <StoryUploader />
              </motion.div>
            )}
            
            {Object.entries(groupedStories).map(([creatorId, creatorStories], index) => (
              <motion.div 
                key={creatorId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative shrink-0"
              >
                <StoryItem
                  story={creatorStories[0]}
                  isStacked={creatorStories.length > 1}
                  stackCount={creatorStories.length - 1}
                  onDelete={
                    session?.user?.id === creatorId 
                      ? () => handleDeleteStory(creatorStories[0].id)
                      : undefined
                  }
                  onClick={() => {
                    const index = stories.findIndex(s => s.id === creatorStories[0].id);
                    setSelectedStoryIndex(index);
                  }}
                />
              </motion.div>
            ))}

            {stories.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center w-full py-4"
              >
                <span className="text-luxury-neutral/60 text-sm">
                  No stories yet
                </span>
              </motion.div>
            )}
          </div>

          {stories.length > (isMobile ? 3 : 5) && (
            <StoryNavigation 
              onScroll={(direction) => {
                if (containerRef.current) {
                  const scrollAmount = direction === "left" ? -200 : 200;
                  containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
                }
              }} 
            />
          )}
        </div>
      </div>
      
      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </div>
  );
};
