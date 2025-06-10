
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/integrations/supabase/types/post";

const POSTS_PER_PAGE = 5;

export type FeedType = 'feed' | 'popular' | 'recent' | 'shorts';

export const useFeedQuery = (userId?: string, feedType: FeedType = 'feed') => {
  return useInfiniteQuery({
    queryKey: ["posts", userId, feedType],
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number || 0) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      console.log(`Fetching ${feedType} posts from ${from} to ${to}`);

      let query = supabase
        .from("posts")
        .select(`
          *,
          creator:profiles!posts_creator_id_fkey(id, username, avatar_url),
          post_likes(user_id),
          post_saves(user_id),
          media_assets!media_assets_post_id_fkey(
            id,
            storage_path,
            media_type,
            mime_type,
            original_name,
            alt_text
          )
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      // Apply different filters based on feed type
      switch (feedType) {
        case 'popular':
          query = query.order('engagement_score', { ascending: false });
          break;
        case 'shorts':
          // Look for posts with video media assets
          query = query.not('media_assets.media_type', 'is', null)
                      .like('media_assets.media_type', 'video%');
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

      console.log("Fetched posts:", posts?.length || 0);

      return posts?.map(post => ({
        ...post,
        has_liked: post.post_likes?.some(like => like.user_id === userId) || false,
        has_saved: post.post_saves?.some(save => save.user_id === userId) || false,
        visibility: post.visibility || 'public',
        screenshots_count: post.screenshots_count || 0,
        downloads_count: post.downloads_count || 0,
        video_urls: [],
        media_url: [],
        updated_at: post.updated_at || post.created_at,
        view_count: post.view_count || 0,
        video_thumbnail_url: null,
        media_assets: Array.isArray(post.media_assets) ? post.media_assets : []
      })) as Post[];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === POSTS_PER_PAGE ? allPages.length : undefined;
    }
  });
};
