
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useFeedQuery } from "../../feed/useFeedQuery";
import { Short } from "../types/short";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Post } from "@/integrations/supabase/types/post";

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
  const shorts: Short[] = (data?.pages?.flatMap(page => page) ?? []).map(post => {
    if (!post || typeof post !== 'object') return {} as Short;
    
    // Use type assertion for safer property access
    const typedPost = post as Post;
    
    return {
      id: typedPost.id || '',
      creator: {
        id: typedPost.creator?.id || '',
        username: typedPost.creator?.username || 'Anonymous',
        avatar_url: typedPost.creator?.avatar_url || null,
        created_at: typedPost.created_at || '',
        updated_at: typedPost.created_at || ''
      },
      creator_id: typedPost.creator_id || '',
      content: typedPost.content || '',
      video_urls: typedPost.video_urls || [],
      likes_count: typedPost.likes_count || 0,
      comments_count: typedPost.comments_count || 0,
      has_liked: !!typedPost.has_liked,
      has_saved: !!typedPost.has_saved,
      created_at: typedPost.created_at || '',
      view_count: typedPost.view_count || 0,
      visibility: typedPost.visibility || 'public',
      description: typedPost.content || ''
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
