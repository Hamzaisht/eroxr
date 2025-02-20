
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StoryStats } from "../types/story-actions";

export const useStoryStats = (storyId: string) => {
  const [stats, setStats] = useState<StoryStats>({
    views: 0,
    screenshots: 0,
    shares: 0,
    comments: 0
  });

  const fetchStoryStats = async () => {
    try {
      const { data: viewsData } = await supabase
        .from('post_media_actions')
        .select('action_type')
        .eq('post_id', storyId);

      if (viewsData) {
        setStats({
          views: viewsData.filter(d => d.action_type === 'view').length,
          screenshots: viewsData.filter(d => d.action_type === 'screenshot').length,
          shares: viewsData.filter(d => d.action_type === 'share').length,
          comments: viewsData.filter(d => d.action_type === 'comment').length
        });
      }
    } catch (error) {
      console.error('Error fetching story stats:', error);
    }
  };

  useEffect(() => {
    fetchStoryStats();

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
          fetchStoryStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storyId]);

  return stats;
};
