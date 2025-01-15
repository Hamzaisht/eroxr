import { useEffect, useRef, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { supabase } from "@/integrations/supabase/client";
import { StoryUploader } from "./story/StoryUploader";
import { StoryItem } from "./story/StoryItem";
import { StoryViewer } from "./story/StoryViewer";
import { StoryNavigation } from "./story/StoryNavigation";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    const fetchStories = async () => {
      try {
        console.info('Fetching stories');
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

    fetchStories();

    // Set up real-time subscription for stories
    console.info('Setting up real-time subscription for stories');
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
  }, [toast]);

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
      <div className="w-full h-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide relative"
      >
        {session && <StoryUploader />}
        
        {Object.entries(groupedStories).map(([creatorId, creatorStories]) => (
          <StoryItem
            key={creatorId}
            story={creatorStories[0]}
            onClick={() => {
              const index = stories.findIndex(s => s.id === creatorStories[0].id);
              setSelectedStoryIndex(index);
            }}
          />
        ))}
      </div>

      {stories.length > 0 && (
        <>
          <StoryNavigation onScroll={handleScroll} />
          
          {selectedStoryIndex !== null && (
            <StoryViewer
              stories={stories}
              initialStoryIndex={selectedStoryIndex}
              onClose={() => setSelectedStoryIndex(null)}
            />
          )}
        </>
      )}
    </div>
  );
};