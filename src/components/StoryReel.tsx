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

interface GroupedStories {
  [creatorId: string]: Story[];
}

export const StoryReel = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchStories = async () => {
      try {
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
        setStories(data || []);
      } catch (error) {
        console.error('Error fetching stories:', error);
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

    const subscription = supabase
      .channel('stories_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stories'
        },
        () => {
          console.info('Story subscription status: SUBSCRIBED');
          fetchStories();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [session?.user?.id, toast]);

  const handleScroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    
    const scrollAmount = direction === "left" ? -200 : 200;
    containerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
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

  if (isLoading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-luxury-dark/40 backdrop-blur-lg rounded-xl p-4 mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white/90">Stories</h2>
      </div>
      
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide relative"
      >
        {session && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
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
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            <StoryItem
              story={creatorStories[0]}
              isStacked={creatorStories.length > 1}
              stackCount={creatorStories.length - 1}
              onClick={() => {
                const index = stories.findIndex(s => s.id === creatorStories[0].id);
                setSelectedStoryIndex(index);
              }}
            />
          </motion.div>
        ))}

        {stories.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center w-full py-8">
            <p className="text-white/60 text-sm">No stories yet</p>
          </div>
        )}
      </div>

      {stories.length > (isMobile ? 3 : 5) && (
        <StoryNavigation onScroll={handleScroll} />
      )}
      
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