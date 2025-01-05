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
          tags
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

      return posts?.map(post => ({
        ...post,
        has_liked: post.has_liked?.length > 0,
        visibility: post.visibility as "subscribers_only" | "public"
      })) || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === POSTS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};