import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Post } from "./types";
import { useEffect } from "react";

const POSTS_PER_PAGE = 5;

export const useFeedQuery = (userId?: string, feedType: 'feed' | 'popular' | 'recent' | 'shorts' = 'feed') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up real-time subscription for new posts
  useEffect(() => {
    console.log("Setting up real-time subscription for posts");
    
    const channel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        async (payload) => {
          console.log("Received real-time update:", payload);
          
          queryClient.invalidateQueries({
            queryKey: ["posts", feedType]
          });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, feedType]);

  return useInfiniteQuery({
    queryKey: ["posts", userId, feedType],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      console.log(`Fetching ${feedType} posts from ${from} to ${to}`);

      let query = supabase
        .from("posts")
        .select(`
          id,
          content,
          created_at,
          creator_id,
          creator:profiles(username, avatar_url),
          likes_count,
          comments_count,
          media_url,
          video_urls,
          post_likes!inner (
            id
          ),
          visibility,
          tags,
          is_ppv,
          ppv_amount,
          screenshots_count,
          downloads_count
        `, { count: 'exact' })
        .order("created_at", { ascending: false })
        .range(from, to);

      // Apply different filters based on feed type
      switch (feedType) {
        case 'popular':
          query = query
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('likes_count', { ascending: false });
          break;
        case 'recent':
          if (userId) {
            // First get the creator IDs the user is subscribed to
            const { data: subscriptions } = await supabase
              .from('creator_subscriptions')
              .select('creator_id')
              .eq('user_id', userId);
            
            const creatorIds = subscriptions?.map(sub => sub.creator_id) || [];
            
            // Then filter posts by these creator IDs
            if (creatorIds.length > 0) {
              query = query.in('creator_id', creatorIds);
            } else {
              // If user isn't subscribed to anyone, return empty array
              return [];
            }
          }
          break;
        case 'shorts':
          query = query
            .not('video_urls', 'is', null)
            .eq('visibility', 'public');
          break;
        default:
          if (userId) {
            // For the feed, show posts from creators the user follows or has liked
            const { data: likedPosts } = await supabase
              .from('post_likes')
              .select('post_id')
              .eq('user_id', userId);

            const likedPostIds = likedPosts?.map(like => like.post_id) || [];
            
            if (likedPostIds.length > 0) {
              query = query.or(`creator_id.eq.${userId},id.in.(${likedPostIds.join(',')})`);
            } else {
              query = query.eq('creator_id', userId);
            }
          }
      }

      const { data: posts, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error fetching posts",
          description: "Could not load posts. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      // If there are posts and a user is logged in, check for PPV purchases and likes
      if (posts && posts.length > 0 && userId) {
        const { data: purchases } = await supabase
          .from('post_purchases')
          .select('post_id')
          .eq('user_id', userId)
          .in('post_id', posts.map(post => post.id));

        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId)
          .in('post_id', posts.map(post => post.id));

        const purchasedPostIds = new Set(purchases?.map(p => p.post_id) || []);
        const likedPostIds = new Set(likes?.map(l => l.post_id) || []);

        return posts.map(post => ({
          ...post,
          has_liked: likedPostIds.has(post.id),
          visibility: post.visibility as "subscribers_only" | "public",
          has_purchased: purchasedPostIds.has(post.id),
          screenshots_count: post.screenshots_count || 0,
          downloads_count: post.downloads_count || 0
        }));
      }

      return posts?.map(post => ({
        ...post,
        has_liked: false,
        visibility: post.visibility as "subscribers_only" | "public",
        has_purchased: false,
        screenshots_count: post.screenshots_count || 0,
        downloads_count: post.downloads_count || 0
      })) || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === POSTS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};