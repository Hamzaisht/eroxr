
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ErosVideo } from "@/types/eros";

interface UseShortsPaginationProps {
  initialShortId?: string | null;
  pageSize?: number;
}

export function useShortsPagination({ initialShortId, pageSize = 5 }: UseShortsPaginationProps = {}) {
  const [shorts, setShorts] = useState<ErosVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const session = useSession();
  const { toast } = useToast();
  
  // Map database data to ErosVideo type
  const mapVideoData = useCallback((video: any, userId?: string): ErosVideo => {
    return {
      id: video.id,
      url: video.video_urls?.[0] || '',
      thumbnailUrl: video.video_thumbnail_url,
      description: video.content,
      creator: {
        id: video.creator_id,
        name: video.profiles?.username || 'Unknown',
        username: video.profiles?.username || 'user',
        avatarUrl: video.profiles?.avatar_url,
      },
      stats: {
        likes: video.likes_count || 0,
        comments: video.comments_count || 0,
        shares: video.share_count || 0,
        views: video.view_count || 0,
      },
      hasLiked: video.has_liked || false,
      hasSaved: video.has_saved || false,
      createdAt: video.created_at,
      tags: video.tags || [],
    };
  }, []);
  
  // Fetch videos, handling initial video if specified
  const fetchVideos = useCallback(async (loadPage: number, resetVideos = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Base query
      let query = supabase
        .from('posts')
        .select(`
          id,
          content,
          video_urls,
          video_thumbnail_url,
          created_at,
          likes_count,
          comments_count,
          share_count,
          view_count,
          tags,
          creator_id,
          profiles:creator_id (
            username,
            avatar_url,
            id
          )
        `)
        .eq('visibility', 'public')
        .not('video_urls', 'is', null);
        
      // If loading initial short video
      if (loadPage === 1 && initialShortId && !initialLoaded) {
        const { data: initialVideo, error: initialError } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            video_urls,
            video_thumbnail_url,
            created_at,
            likes_count,
            comments_count,
            share_count,
            view_count,
            tags,
            creator_id,
            profiles:creator_id (
              username,
              avatar_url,
              id
            )
          `)
          .eq('id', initialShortId)
          .single();
        
        // Fetch regular videos, excluding the initial one if found
        const { data: regularVideos, error: regularError } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            video_urls,
            video_thumbnail_url,
            created_at,
            likes_count,
            comments_count,
            share_count,
            view_count,
            tags,
            creator_id,
            profiles:creator_id (
              username,
              avatar_url,
              id
            )
          `)
          .eq('visibility', 'public')
          .not('video_urls', 'is', null)
          .order('created_at', { ascending: false })
          .range((loadPage - 1) * pageSize, loadPage * pageSize - 1)
          .neq(initialVideo ? 'id' : 'invalid-id', initialVideo?.id || 'invalid-id');
        
        if (initialError && !initialVideo) {
          console.log('Initial video not found, loading regular feed');
        } else if (initialVideo) {
          console.log('Initial video found, adding to feed');
          setInitialLoaded(true);
        }
        
        if (regularError) {
          throw new Error(regularError.message);
        }
        
        const mappedVideos = [];
        
        // Add initial video at the beginning if found
        if (initialVideo) {
          mappedVideos.push(mapVideoData(initialVideo, session?.user?.id));
        }
        
        // Add regular videos
        if (regularVideos) {
          mappedVideos.push(...regularVideos.map(video => mapVideoData(video, session?.user?.id)));
        }
        
        setShorts(prev => resetVideos ? mappedVideos : [...prev, ...mappedVideos]);
        setHasMore(regularVideos ? regularVideos.length === pageSize : false);
      } else {
        // Regular pagination
        const { data, error: queryError } = await query
          .order('created_at', { ascending: false })
          .range((loadPage - 1) * pageSize, loadPage * pageSize - 1);
        
        if (queryError) {
          throw new Error(queryError.message);
        }
        
        const mappedVideos = (data || []).map(video => mapVideoData(video, session?.user?.id));
        
        setShorts(prev => resetVideos ? mappedVideos : [...prev, ...mappedVideos]);
        setHasMore(data ? data.length === pageSize : false);
      }
    } catch (err: any) {
      console.error('Error fetching shorts:', err);
      setError(err.message || 'Failed to load videos');
      
      // If there's an error, but we already have videos, don't show toast
      if (shorts.length === 0) {
        toast({
          title: "Error loading videos",
          description: err.message || "Something went wrong",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [initialShortId, initialLoaded, pageSize, mapVideoData, session, toast, shorts.length]);

  // Load next page
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);
  
  // Initial fetch
  useEffect(() => {
    fetchVideos(1, true);
  }, [fetchVideos]);
  
  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchVideos(page);
    }
  }, [page, fetchVideos]);
  
  // Reset when initial short ID changes
  useEffect(() => {
    if (initialShortId) {
      setShorts([]);
      setPage(1);
      setInitialLoaded(false);
      fetchVideos(1, true);
    }
  }, [initialShortId, fetchVideos]);
  
  // Handle interaction with videos (like, save, share)
  const handleLike = useCallback(async (videoId: string) => {
    // Implementation of like functionality
    setShorts(prev => 
      prev.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              hasLiked: !video.hasLiked, 
              stats: { 
                ...video.stats, 
                likes: video.hasLiked ? Math.max(0, video.stats.likes - 1) : video.stats.likes + 1 
              } 
            }
          : video
      )
    );
  }, []);
  
  const handleSave = useCallback(async (videoId: string) => {
    // Implementation of save functionality
    setShorts(prev => 
      prev.map(video => 
        video.id === videoId 
          ? { ...video, hasSaved: !video.hasSaved }
          : video
      )
    );
  }, []);
  
  const handleShare = useCallback(async (videoId: string) => {
    // Implementation of share tracking
    setShorts(prev => 
      prev.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              stats: { 
                ...video.stats, 
                shares: video.stats.shares + 1 
              } 
            }
          : video
      )
    );
  }, []);
  
  return {
    shorts,
    isLoading,
    error,
    hasMore,
    loadMore,
    currentIndex,
    setCurrentIndex,
    handleLike,
    handleSave,
    handleShare,
    refresh: () => {
      setPage(1);
      setShorts([]);
      return fetchVideos(1, true);
    }
  };
}
