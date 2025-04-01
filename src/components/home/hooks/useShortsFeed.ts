
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useFeedQuery } from "../../feed/useFeedQuery";
import { Short } from "../types/short";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useShortsFeed = (specificShortId?: string | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const session = useSession();
  const queryClient = useQueryClient();
  
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isError,
    error
  } = useFeedQuery(session?.user?.id, 'shorts');

  // Transform data to Short format
  const shorts: Short[] = (data?.pages.flatMap(page => page) ?? []).map(post => ({
    id: post.id,
    creator: {
      username: post.creator?.username || 'Anonymous',
      avatar_url: post.creator?.avatar_url || null,
      id: post.creator_id
    },
    creator_id: post.creator_id,
    content: post.content,
    video_urls: post.video_urls,
    likes_count: post.likes_count,
    comments_count: post.comments_count,
    has_liked: post.has_liked,
    has_saved: post.has_saved || false,
    created_at: post.created_at,
    view_count: post.view_count || 0,
    visibility: post.visibility,
    description: post.content // Use content as description since description doesn't exist on Post
  }));

  // Update loading state when data changes
  useEffect(() => {
    if (data || isError) {
      setIsLoading(false);
    }
  }, [data, isError]);

  // Load next page when approaching the end
  useEffect(() => {
    if (currentVideoIndex >= shorts.length - 2 && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [currentVideoIndex, shorts.length, fetchNextPage, hasNextPage, isLoading]);

  // Set initial index based on specificShortId
  useEffect(() => {
    if (specificShortId && shorts.length > 0) {
      const index = shorts.findIndex(short => short.id === specificShortId);
      if (index !== -1) {
        setCurrentVideoIndex(index);
      }
    }
  }, [specificShortId, shorts]);

  const handleRetryLoad = () => {
    setIsLoading(true);
    refetch();
  };

  return {
    shorts,
    currentVideoIndex,
    setCurrentVideoIndex,
    isLoading,
    isError,
    error,
    hasNextPage,
    handleRetryLoad,
    refetch
  };
};
