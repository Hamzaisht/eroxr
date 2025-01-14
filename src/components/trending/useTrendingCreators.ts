import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingCreator } from "./types";

export const useTrendingCreators = () => {
  return useQuery({
    queryKey: ['trending-creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trending_content')
        .select(`
          creator_id,
          creator_username,
          creator_avatar,
          likes,
          comments,
          media_interactions,
          trending_rank
        `)
        .eq('content_type', 'post')
        .order('trending_rank', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data as TrendingCreator[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
};