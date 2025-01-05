import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Post } from "./types";

export const POSTS_PER_PAGE = 5;

export const usePosts = (userId: string | undefined, currentPage: number) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["posts", userId, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data: posts, error, count } = await supabase
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
        `, { count: 'exact' })
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

      return {
        posts: posts?.map(post => ({
          ...post,
          has_liked: post.has_liked?.length > 0,
          visibility: post.visibility as 'public' | 'subscribers_only'
        })) || [],
        totalCount: count || 0
      };
    },
  });
};