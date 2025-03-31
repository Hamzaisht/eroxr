
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
    created_at: post.created_at
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

  // Handle view tracking
  useEffect(() => {
    if (!shorts[currentVideoIndex] || !session?.user?.id) return;
    
    const videoId = shorts[currentVideoIndex].id;
    
    const updateViewCount = async () => {
      try {
        const { error } = await supabase
          .from('posts')
          .update({ view_count: supabase.rpc('increment_counter', { row_id: videoId, counter_name: 'view_count' }) })
          .eq('id', videoId);
          
        if (error) console.error('Error updating view count:', error);
      } catch (err) {
        console.error('Failed to update view count:', err);
      }
    };
    
    updateViewCount();
    
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }, [currentVideoIndex, session?.user?.id, shorts, queryClient]);

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
