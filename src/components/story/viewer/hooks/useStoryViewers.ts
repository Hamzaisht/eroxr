
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StoryViewer, PostMediaAction } from "../types/story-actions";

export const useStoryViewers = (storyId: string) => {
  const [viewers, setViewers] = useState<StoryViewer[]>([]);

  const fetchViewers = async () => {
    try {
      const { data } = await supabase
        .from('post_media_actions')
        .select(`
          id,
          action_type,
          created_at,
          user_id,
          profiles!inner (
            username,
            avatar_url
          )
        `)
        .eq('post_id', storyId)
        .order('created_at', { ascending: false });

      if (data) {
        const viewersData = (data as unknown as PostMediaAction[]).map(d => ({
          id: d.id,
          username: d.profiles.username || 'Unknown',
          avatar_url: d.profiles.avatar_url || '',
          action_type: d.action_type,
          created_at: d.created_at
        }));
        setViewers(viewersData);
      }
    } catch (error) {
      console.error('Error fetching viewers:', error);
    }
  };

  useEffect(() => {
    fetchViewers();

    const channel = supabase
      .channel('story-interactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_media_actions',
          filter: `post_id=eq.${storyId}`
        },
        () => {
          fetchViewers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storyId]);

  return viewers;
};
