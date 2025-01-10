import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Post } from "./types";
import { useEffect } from "react";

const POSTS_PER_PAGE = 5;

export const useFeedQuery = (userId?: string, feedType: 'feed' | 'popular' | 'recent' | 'shorts' = 'feed') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        (payload) => {
          console.log("Received real-time update:", payload);
          queryClient.invalidateQueries({ queryKey: ["posts", feedType] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New post",
              description: "Someone just shared something new!",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, feedType, toast]);

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
          creator:profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      // Apply different filters based on feed type
      switch (feedType) {
        case 'popular':
          query = query
            .order('likes_count', { ascending: false });
          break;
        case 'recent':
          // Show all recent posts for now
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
        has_liked: false,
        visibility: post.visibility || 'public',
        screenshots_count: post.screenshots_count || 0,
        downloads_count: post.downloads_count || 0
      })) || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === POSTS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 0,
    refetchInterval: 0,
  });
};