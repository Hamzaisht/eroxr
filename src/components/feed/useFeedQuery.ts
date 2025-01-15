import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/integrations/supabase/types/post";

const POSTS_PER_PAGE = 5;

export const useFeedQuery = (userId?: string, feedType: 'feed' | 'popular' | 'recent' = 'feed') => {
  return useInfiniteQuery({
    queryKey: ["posts", userId, feedType],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      console.log(`Fetching ${feedType} posts from ${from} to ${to}`);

      let query = supabase
        .from("posts")
        .select(`
          *,
          creator:profiles(id, username, avatar_url),
          post_likes(user_id)
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      // Apply different filters based on feed type
      switch (feedType) {
        case 'popular':
          query = query.order('engagement_score', { ascending: false });
          break;
        case 'recent':
          // Show all recent posts
          break;
        default:
          if (userId) {
            query = query.eq('creator_id', userId);
          }
      }

      const { data: posts, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      return posts?.map(post => ({
        ...post,
        has_liked: post.post_likes?.length > 0,
        visibility: post.visibility || 'public',
        screenshots_count: post.screenshots_count || 0,
        downloads_count: post.downloads_count || 0,
        video_urls: post.video_urls || [],
        media_url: post.media_url || [],
        updated_at: post.updated_at || post.created_at
      })) as Post[];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === POSTS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};