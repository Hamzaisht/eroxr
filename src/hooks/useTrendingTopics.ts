
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TrendingTag {
  tag: string;
  count: number;
  percentageIncrease: number;
}

export interface TrendingData {
  trendingTags: TrendingTag[];
  posts: any[];
}

export function useTrendingTopics() {
  return useQuery({
    queryKey: ["trending-tags"],
    queryFn: async (): Promise<TrendingData> => {
      // Call the Supabase function we created
      const { data: trendingTags, error } = await supabase.rpc('get_top_trending_hashtags');
      
      if (error) {
        console.error("Error fetching trending tags:", error);
        return { trendingTags: [], posts: [] };
      }
      
      // Format the response to match expected format
      const formattedTags = trendingTags.map((tag: any) => ({
        tag: tag.tag.startsWith('#') ? tag.tag : `#${tag.tag}`,
        count: Number(tag.count),
        percentageIncrease: tag.percentageIncrease
      }));

      // Get related posts to provide context
      const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      
      return { 
        trendingTags: formattedTags, 
        posts: posts || [] 
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
