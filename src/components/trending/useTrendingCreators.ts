

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingCreator } from "./types";

export const useTrendingCreators = () => {
  return useQuery({
    queryKey: ['trending-creators'],
    queryFn: async () => {
      // Get trending creators by aggregating trending_content data by creator
      const { data, error } = await supabase
        .from('trending_content')
        .select(`
          score,
          likes,
          comments,
          bookmarks,
          screenshots,
          posts!inner (
            creator_id,
            profiles!posts_creator_id_fkey (
              id,
              username
            )
          )
        `)
        .order('score', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching trending creators:", error);
        throw error;
      }

      // Aggregate by creator and calculate metrics
      const creatorMap = new Map();
      
      data?.forEach((item, index) => {
        // Access the posts data - it should be a single object due to !inner
        const postData = Array.isArray(item.posts) ? item.posts[0] : item.posts;
        
        if (!postData) return;
        
        // Access the profiles data - it should be a single object due to foreign key
        const creatorData = Array.isArray(postData.profiles) ? postData.profiles[0] : postData.profiles;
        const creatorId = postData.creator_id;
        
        if (!creatorMap.has(creatorId)) {
          creatorMap.set(creatorId, {
            creator_id: creatorId,
            creator_username: creatorData?.username || 'Unknown',
            creator_avatar: null, // We'll need to get this from media_assets if needed
            likes: 0,
            comments: 0,
            media_interactions: 0,
            trending_rank: index + 1
          });
        }
        
        const existing = creatorMap.get(creatorId);
        existing.likes += item.likes || 0;
        existing.comments += item.comments || 0;
        existing.media_interactions += (item.bookmarks || 0) + (item.screenshots || 0);
      });

      // Convert map to array and sort by total engagement
      const creators = Array.from(creatorMap.values())
        .sort((a, b) => {
          const scoreA = a.likes + a.comments + a.media_interactions;
          const scoreB = b.likes + b.comments + b.media_interactions;
          return scoreB - scoreA;
        })
        .slice(0, 3)
        .map((creator, index) => ({
          ...creator,
          trending_rank: index + 1
        }));

      return creators as TrendingCreator[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

