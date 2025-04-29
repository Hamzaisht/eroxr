
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
  const shorts: Short[] = (data?.pages.flatMap(page => page) ?? []).map(post => {
    if (!post) return {} as Short;
    
    return {
      id: post.id || '',
      creator: {
        id: post.creator?.id || '',
        username: post.creator?.username || 'Anonymous',
        avatar_url: post.creator?.avatar_url || null,
        created_at: post.created_at || '',
        updated_at: post.created_at || ''
      },
      creator_id: post.creator_id || '',
      content: post.content || '',
      video_urls: post.video_urls || [],
      likes_count: post.likes_count || 0,
      comments_count: post.comments_count || 0,
      has_liked: !!post.has_liked,
      has_saved: !!post.has_saved,
      created_at: post.created_at || '',
      view_count: post.view_count || 0,
      visibility: post.visibility || 'public',
      description: post.content || ''
    };
  });

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
