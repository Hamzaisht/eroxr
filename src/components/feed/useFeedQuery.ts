import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Post } from "./types";

const POSTS_PER_PAGE = 5;

export const useFeedQuery = (userId?: string) => {
  const { toast } = useToast();

  return useInfiniteQuery({
    queryKey: ["posts", userId],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      // First get the posts
      const { data: posts, error } = await supabase
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
          has_liked:post_likes!inner(id),
          visibility,
          tags,
          is_ppv,
          ppv_amount
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        toast({
          title: "Error fetching posts",
          description: "Could not load posts. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      // If there are posts and a user is logged in, check for PPV purchases
      if (posts && posts.length > 0 && userId) {
        const { data: purchases } = await supabase
          .from('post_purchases')
          .select('post_id')
          .eq('user_id', userId)
          .in('post_id', posts.map(post => post.id));

        const purchasedPostIds = new Set(purchases?.map(p => p.post_id) || []);

        return posts.map(post => ({
          ...post,
          has_liked: post.has_liked?.length > 0,
          visibility: post.visibility as "subscribers_only" | "public",
          has_purchased: purchasedPostIds.has(post.id)
        }));
      }

      // If no user is logged in or no posts, just return the posts without purchase info
      return posts?.map(post => ({
        ...post,
        has_liked: post.has_liked?.length > 0,
        visibility: post.visibility as "subscribers_only" | "public",
        has_purchased: false
      })) || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === POSTS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};