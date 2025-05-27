
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
      console.log("Fetching real trending topics from database...");
      
      try {
        // Get recent posts with engagement data
        const { data: posts, error: postsError } = await supabase
          .from("posts")
          .select(`
            *,
            creator:profiles!posts_creator_id_fkey(id, username)
          `)
          .order("created_at", { ascending: false })
          .limit(50);
        
        if (postsError) {
          console.error("Error fetching posts for trending:", postsError);
          throw postsError;
        }

        // Calculate trending tags from actual posts
        const tagFrequency: Record<string, number> = {};
        const recentTagFrequency: Record<string, number> = {};
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        posts?.forEach(post => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => {
              const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
              tagFrequency[cleanTag] = (tagFrequency[cleanTag] || 0) + 1;
              
              // Count recent posts separately for percentage increase calculation
              if (new Date(post.created_at) > oneDayAgo) {
                recentTagFrequency[cleanTag] = (recentTagFrequency[cleanTag] || 0) + 1;
              }
            });
          }
        });

        // Create trending tags with real percentage calculations
        const trendingTags: TrendingTag[] = Object.entries(tagFrequency)
          .map(([tag, count]) => {
            const recentCount = recentTagFrequency[tag] || 0;
            const olderCount = count - recentCount;
            
            // Calculate percentage increase (recent vs older posts)
            let percentageIncrease = 0;
            if (olderCount > 0) {
              percentageIncrease = Math.round((recentCount / olderCount) * 100);
            } else if (recentCount > 0) {
              percentageIncrease = 100; // New trending tag
            }

            return {
              tag,
              count,
              percentageIncrease: Math.min(percentageIncrease, 999) // Cap at 999%
            };
          })
          .sort((a, b) => {
            // Sort by engagement score: recent activity + total count
            const scoreA = a.percentageIncrease + a.count;
            const scoreB = b.percentageIncrease + b.count;
            return scoreB - scoreA;
          })
          .slice(0, 10); // Top 10 trending tags

        console.log("Real trending tags calculated:", trendingTags);

        return { 
          trendingTags, 
          posts: posts || [] 
        };
      } catch (error) {
        console.error("Error fetching trending data:", error);
        // Fallback to empty data instead of mock data
        return { trendingTags: [], posts: [] };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
