import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";
import { StoryUploader } from "./story/StoryUploader";
import { StoryItem } from "./story/StoryItem";
import { StoryNavigation } from "./story/StoryNavigation";

export const StoryReel = () => {
  const session = useSession();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: stories } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id,
          media_url,
          creator:profiles(
            id,
            username,
            avatar_url
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
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

  if (!stories?.length && !session) return null;

  return (
    <div className="relative">
      <StoryNavigation onScroll={scroll} />
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2"
      >
        {session && <StoryUploader />}

        {stories?.map((story, index) => (
          <StoryItem key={story.id} story={story} index={index} />
        ))}
      </div>
    </div>
  );
};