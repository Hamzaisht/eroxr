import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";
import { StoryUploader } from "./story/StoryUploader";
import { StoryItem } from "./story/StoryItem";
import { StoryNavigation } from "./story/StoryNavigation";

interface Creator {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface Story {
  id: string;
  media_url: string;
  video_url: string | null;
  duration: number | null;
  created_at: string;
  expires_at: string;
  creator: Creator;
}

interface GroupedStory {
  creator: Creator;
  stories: Story[];
}

export const StoryReel = () => {
  const session = useSession();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Setting up real-time subscription for stories");
    
    const channel = supabase
      .channel('public:stories')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stories'
        },
        (payload) => {
          console.log("Received story update:", payload);
          queryClient.invalidateQueries({
            queryKey: ["stories"]
          });
        }
      )
      .subscribe((status) => {
        console.log("Story subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: stories, isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      console.log("Fetching stories");
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data, error } = await supabase
        .from("stories")
        .select(`
          id,
          media_url,
          video_url,
          duration,
          created_at,
          expires_at,
          creator:profiles!stories_creator_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq("is_active", true)
        .gte("created_at", twentyFourHoursAgo.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching stories:", error);
        throw error;
      }

      // Group stories by creator
      const groupedStories = data.reduce((acc: Record<string, GroupedStory>, story: any) => {
        const creatorId = story.creator.id;
        if (!acc[creatorId]) {
          acc[creatorId] = {
            creator: story.creator,
            stories: []
          };
        }
        acc[creatorId].stories.push({
          ...story,
          creator: story.creator
        });
        return acc;
      }, {});

      return Object.values(groupedStories) as GroupedStory[];
    }
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === "left" 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth"
      });
      
      setScrollPosition(newPosition);
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="w-28 h-40 rounded-xl bg-luxury-dark/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!stories?.length && !session) return null;

  return (
    <div className="relative">
      <StoryNavigation onScroll={scroll} />
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2"
      >
        {session && <StoryUploader />}

        {stories?.map((groupedStory: GroupedStory) => (
          <StoryItem 
            key={groupedStory.creator.id} 
            stories={groupedStory.stories}
            creator={groupedStory.creator}
            index={0}
          />
        ))}
      </div>
    </div>
  );
};