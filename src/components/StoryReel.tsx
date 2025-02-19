
import { useEffect, useRef, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { motion, AnimatePresence } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { supabase } from "@/integrations/supabase/client";
import { StoryUploader } from "./story/StoryUploader";
import { StoryItem } from "./story/StoryItem";
import { StoryViewer } from "./story/StoryViewer";
import { StoryNavigation } from "./story/StoryNavigation";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-mobile";
import { AlertCircle, Loader2 } from "lucide-react";

interface GroupedStories {
  [creatorId: string]: Story[];
}

export const StoryReel = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setError(null);
        console.info('Fetching stories');
        
        const { data: subscriptions, error: subsError } = await supabase
          .from('creator_subscriptions')
          .select('creator_id')
          .eq('user_id', session?.user?.id);

        if (subsError) throw subsError;

        const { data: following, error: followError } = await supabase
          .from('followers')
          .select('following_id')
          .eq('follower_id', session?.user?.id);

        if (followError) throw followError;

        const creatorIds = [
          ...(subscriptions?.map(sub => sub.creator_id) || []),
          ...(following?.map(f => f.following_id) || [])
        ];

        if (session?.user?.id) {
          creatorIds.push(session.user.id);
        }

        const uniqueCreatorIds = [...new Set(creatorIds)];

        if (uniqueCreatorIds.length === 0) {
          setStories([]);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('stories')
          .select(`
            *,
            creator:profiles!stories_creator_id_fkey(
              id,
              username,
              avatar_url
            )
          `)
          .eq('is_active', true)
          .in('creator_id', uniqueCreatorIds)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const validStories = data?.filter(story => 
          (story.media_url || story.video_url) && story.creator
        ) || [];

        setStories(validStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setError('Failed to load stories');
        toast({
          title: "Error loading stories",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchStories();
    }
  }, [session?.user?.id, toast]);

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

  if (isLoading) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-luxury-dark/40 backdrop-blur-md rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
          <p className="text-sm text-luxury-neutral">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-luxury-dark/40 backdrop-blur-md rounded-xl">
        <div className="flex flex-col items-center gap-2 text-red-500">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-luxury-dark/60 via-luxury-darker/40 to-luxury-dark/60 backdrop-blur-xl rounded-xl p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
          Stories
        </h2>
        <p className="text-sm text-white/60 mt-1">
          Watch and share moments with your favorite creators
        </p>
      </div>
      
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide relative py-4 px-2"
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
            <div className="flex flex-col items-center justify-center w-full py-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/60 text-sm"
              >
                No stories yet
              </motion.div>
            </div>
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
