
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ErosVideo } from "@/types/eros";

interface UseErosFeedOptions {
  initialVideoId?: string | null;
}

export function useErosFeed({ initialVideoId }: UseErosFeedOptions = {}) {
  const [videos, setVideos] = useState<ErosVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const session = useSession();
  const { toast } = useToast();
  
  // Fetch videos
  const fetchVideos = useCallback(async (initialLoad = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const query = supabase
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
        .limit(10);
      
      // If loading more, use the last video's ID as a cursor
      if (!initialLoad && videos.length > 0) {
        query.lt('created_at', videos[videos.length - 1].createdAt);
      }
      
      // If specified initialVideoId, prioritize it
      if (initialLoad && initialVideoId) {
        // First get the specified video
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
          .eq('id', initialVideoId)
          .single();
        
        if (initialError) {
          console.error('Error fetching initial video:', initialError);
        } else if (initialVideo) {
          // Then get regular feed, but exclude the initial video
          const { data: otherVideos, error: feedError } = await query.neq('id', initialVideoId);
          
          if (feedError) {
            throw new Error(feedError.message);
          }
          
          const mappedInitialVideo = mapVideoData(initialVideo, session?.user?.id);
          const mappedOtherVideos = (otherVideos || [])
            .map(video => mapVideoData(video, session?.user?.id));
          
          // Combine with initial video first
          setVideos([mappedInitialVideo, ...mappedOtherVideos]);
          setHasMore(otherVideos && otherVideos.length === 10);
          setLoading(false);
          return;
        }
      }
      
      // Regular feed fetch
      const { data, error: feedError } = await query;
      
      if (feedError) {
        throw new Error(feedError.message);
      }
      
      const mappedVideos = (data || [])
        .map(video => mapVideoData(video, session?.user?.id));
      
      setVideos(prev => 
        initialLoad ? mappedVideos : [...prev, ...mappedVideos]
      );
      setHasMore(data && data.length === 10);
      
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to load videos');
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [videos, session, initialVideoId, toast]);
  
  // Map database data to ErosVideo type
  const mapVideoData = (video: any, userId?: string): ErosVideo => {
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
      // These would be populated in a real app
      hasLiked: false,
      hasSaved: false,
      createdAt: video.created_at,
      tags: video.tags || [],
    };
  };
  
  // Handle load more
  const loadMoreVideos = useCallback(() => {
    if (!loading && hasMore) {
      fetchVideos(false);
    }
  }, [fetchVideos, loading, hasMore]);
  
  // Initial load
  useEffect(() => {
    fetchVideos(true);
  }, [fetchVideos]);
  
  // Track view when current video changes
  useEffect(() => {
    const trackView = async () => {
      if (!videos.length || !session) return;
      
      const currentVideo = videos[currentIndex];
      if (!currentVideo) return;
      
      try {
        await supabase.rpc('increment_counter', {
          row_id: currentVideo.id,
          counter_name: 'view_count',
          table_name: 'posts'
        });
      } catch (err) {
        console.error('Error tracking view:', err);
      }
    };
    
    trackView();
  }, [currentIndex, videos, session]);
  
  // Video interaction handlers
  const handleLike = useCallback(async (videoId: string) => {
    if (!session) return;
    
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', videoId)
        .eq('user_id', session.user.id)
        .single();
      
      if (existingLike) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id);
        
        // Update local state
        setVideos(prev => 
          prev.map(video => 
            video.id === videoId 
              ? { 
                  ...video, 
                  hasLiked: false, 
                  stats: { 
                    ...video.stats, 
                    likes: Math.max(0, video.stats.likes - 1) 
                  } 
                }
              : video
          )
        );
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: videoId, user_id: session.user.id });
        
        // Update local state
        setVideos(prev => 
          prev.map(video => 
            video.id === videoId 
              ? { 
                  ...video, 
                  hasLiked: true, 
                  stats: { 
                    ...video.stats, 
                    likes: video.stats.likes + 1 
                  } 
                }
              : video
          )
        );
      }
    } catch (err) {
      console.error('Error liking/unliking video:', err);
      toast({
        title: "Error",
        description: "Failed to like video",
        variant: "destructive"
      });
    }
  }, [session, toast]);
  
  const handleSave = useCallback(async (videoId: string) => {
    if (!session) return;
    
    try {
      // Check if already saved
      const { data: existingSave } = await supabase
        .from('post_saves')
        .select('id')
        .eq('post_id', videoId)
        .eq('user_id', session.user.id)
        .single();
      
      if (existingSave) {
        // Unsave
        await supabase
          .from('post_saves')
          .delete()
          .eq('id', existingSave.id);
        
        // Update local state
        setVideos(prev => 
          prev.map(video => 
            video.id === videoId 
              ? { ...video, hasSaved: false }
              : video
          )
        );
        
        toast({
          description: "Video removed from saved items"
        });
      } else {
        // Save
        await supabase
          .from('post_saves')
          .insert({ post_id: videoId, user_id: session.user.id });
        
        // Update local state
        setVideos(prev => 
          prev.map(video => 
            video.id === videoId 
              ? { ...video, hasSaved: true }
              : video
          )
        );
        
        toast({
          description: "Video saved"
        });
      }
    } catch (err) {
      console.error('Error saving/unsaving video:', err);
      toast({
        title: "Error",
        description: "Failed to save video",
        variant: "destructive"
      });
    }
  }, [session, toast]);
  
  const handleShare = useCallback(async (videoId: string) => {
    try {
      await supabase.rpc('increment_counter', {
        row_id: videoId,
        counter_name: 'share_count',
        table_name: 'posts'
      });
      
      // Update local state
      setVideos(prev => 
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
    } catch (err) {
      console.error('Error tracking share:', err);
    }
  }, []);
  
  return {
    videos,
    currentIndex,
    setCurrentIndex,
    loading,
    error,
    hasMore,
    loadMoreVideos,
    handleLike,
    handleSave,
    handleShare,
    refreshVideos: () => fetchVideos(true),
  };
}
