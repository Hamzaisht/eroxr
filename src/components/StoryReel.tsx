
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StoryCard } from "./story/StoryCard";
import { 
  safeCast, 
  safeDataAccess 
} from "@/utils/supabase/helpers";
import { Database } from "@/integrations/supabase/types/database.types";

type StoryData = Database["public"]["Tables"]["stories"]["Row"] & {
  profiles?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};

export const StoryReel = () => {
  const [isLoadingStories, setIsLoadingStories] = useState(true);

  const { data: stories, isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id,
          creator_id,
          media_url,
          video_url,
          created_at,
          profiles:creator_id(username, avatar_url)
        `)
        .eq("is_active" as keyof Database["public"]["Tables"]["stories"]["Row"], true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return safeCast<StoryData>(data);
    },
  });

  // Ensure stories is a safe array to map over
  const safeStories = safeDataAccess(stories, []);

  return (
    <div className="relative z-10 flex items-center justify-start w-full gap-4 px-4 py-6 overflow-x-auto">
      {safeStories.map((story) => (
        <StoryCard
          key={story.id}
          storyId={story.id}
          creatorId={story.creator_id}
          mediaUrl={story.media_url || undefined}
          videoUrl={story.video_url || undefined}
          username={story.profiles?.username || undefined}
          avatarUrl={story.profiles?.avatar_url || undefined}
          createdAt={story.created_at}
        />
      ))}
    </div>
  );
};
