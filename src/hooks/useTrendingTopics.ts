
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
      // For now, return mock data since we don't have the materialized view set up yet
      console.log("Fetching trending topics...");
      
      try {
        // Try to get some basic trending data from posts
        const { data: posts } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);
        
        // Mock trending tags for now
        const mockTrendingTags = [
          { tag: "#trending", count: 15, percentageIncrease: 25 },
          { tag: "#popular", count: 12, percentageIncrease: 18 },
          { tag: "#viral", count: 8, percentageIncrease: 30 },
          { tag: "#new", count: 6, percentageIncrease: 12 }
        ];

        return { 
          trendingTags: mockTrendingTags, 
          posts: posts || [] 
        };
      } catch (error) {
        console.error("Error fetching trending data:", error);
        return { trendingTags: [], posts: [] };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
