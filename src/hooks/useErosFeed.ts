
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  creator_id: string;
  created_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  creator?: {
    username: string;
    avatar_url: string | null;
  };
  is_liked?: boolean;
  is_saved?: boolean;
}

interface UseErosFeedOptions {
  initialVideoId?: string;
  limit?: number;
}

export const useErosFeed = ({ 
  initialVideoId, 
  limit = 10 
}: UseErosFeedOptions = {}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const session = useSession();
  const { toast } = useToast();

  // Load user likes and saves on mount
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [userSaves, setUserSaves] = useState<Set<string>>(new Set());

  // Fetch user likes
  const fetchUserInteractions = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      // Fetch user likes
      const { data: likesData } = await supabase
        .from('video_likes')
        .select('video_id')
        .eq('user_id', session.user.id);

      // Fetch user saves
      const { data: savesData } = await supabase
        .from('post_saves')  // Assuming saves are stored here
        .select('post_id')
        .eq('user_id', session.user.id);

      // Update state
      if (likesData) {
        setUserLikes(new Set(likesData.map(item => item.video_id)));
      }

      if (savesData) {
        setUserSaves(new Set(savesData.map(item => item.post_id)));
      }
    } catch (err) {
      console.error('Error fetching user interactions:', err);
    }
  }, [session]);

  // Load initial videos, with specific video if initialVideoId is provided
  const loadInitialVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('videos')
        .select(`
          *,
          creator:profiles!creator_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      // If we have an initial video ID, fetch that video first
      if (initialVideoId) {
        const { data: initialVideo, error: initialError } = await supabase
          .from('videos')
          .select(`
            *,
            creator:profiles!creator_id (username, avatar_url)
          `)
          .eq('id', initialVideoId)
          .single();

        if (initialError) {
          console.error('Error fetching initial video:', initialError);
          throw new Error('Could not find the requested video');
        }

        if (initialVideo) {
          // Fetch other videos excluding the initial one
          const { data: otherVideos, error: otherError } = await query
            .neq('id', initialVideoId);

          if (otherError) {
            console.error('Error fetching other videos:', otherError);
            throw new Error('Could not load videos');
          }

          // Combine initial video with others
          const allVideos = [initialVideo, ...(otherVideos || [])];
          
          // Mark liked and saved videos
          const processedVideos = allVideos.map(video => ({
            ...video,
            is_liked: userLikes.has(video.id),
            is_saved: userSaves.has(video.id)
          }));
          
          setVideos(processedVideos);
          setCurrentIndex(0);
          setHasMore(otherVideos?.length === limit);
          setPage(1);
          
          // Increment view count for initial video
          incrementViewCount(initialVideoId);
          return;
        }
      }

      // If no initialVideoId or it wasn't found, just load regular feed
      const { data, error: feedError } = await query;

      if (feedError) {
        console.error('Error fetching videos:', feedError);
        throw new Error('Could not load videos');
      }

      if (data && data.length > 0) {
        // Mark liked and saved videos
        const processedVideos = data.map(video => ({
          ...video,
          is_liked: userLikes.has(video.id),
          is_saved: userSaves.has(video.id)
        }));
        
        setVideos(processedVideos);
        setHasMore(data.length === limit);
        setPage(1);
        
        // Increment view count for first video
        incrementViewCount(data[0].id);
      } else {
        setVideos([]);
        setHasMore(false);
      }
    } catch (err: any) {
      console.error('Error in loadInitialVideos:', err);
      setError(err.message || 'Failed to load videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [initialVideoId, limit, userLikes, userSaves]);

  // Load more videos
  const loadMoreVideos = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const currentIds = videos.map(v => v.id);
      
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          creator:profiles!creator_id (username, avatar_url)
        `)
        .not('id', 'in', `(${currentIds.join(',')})`)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching more videos:', error);
        throw new Error('Could not load more videos');
      }
      
      if (data && data.length > 0) {
        // Mark liked and saved videos
        const processedVideos = data.map(video => ({
          ...video,
          is_liked: userLikes.has(video.id),
          is_saved: userSaves.has(video.id)
        }));
        
        setVideos(prev => [...prev, ...processedVideos]);
        setHasMore(data.length === limit);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error('Error in loadMoreVideos:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to load more videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, videos, limit, userLikes, userSaves, toast]);

  // Handle like action
  const handleLike = useCallback(async (id: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like videos",
        variant: "destructive",
      });
      return;
    }
    
    // Optimistic update
    const currentLikeStatus = userLikes.has(id);
    
    // Update local state
    setVideos(prev => 
      prev.map(video => {
        if (video.id === id) {
          return {
            ...video,
            is_liked: !currentLikeStatus,
            like_count: currentLikeStatus ? Math.max(0, video.like_count - 1) : video.like_count + 1
          };
        }
        return video;
      })
    );
    
    if (currentLikeStatus) {
      // Remove like
      const newLikes = new Set(userLikes);
      newLikes.delete(id);
      setUserLikes(newLikes);
      
      try {
        await supabase
          .from('video_likes')
          .delete()
          .eq('user_id', session.user.id)
          .eq('video_id', id);
      } catch (err) {
        console.error('Error removing like:', err);
        // Revert on error
        const newLikes = new Set(userLikes);
        newLikes.add(id);
        setUserLikes(newLikes);
      }
    } else {
      // Add like
      const newLikes = new Set(userLikes);
      newLikes.add(id);
      setUserLikes(newLikes);
      
      try {
        await supabase
          .from('video_likes')
          .insert({
            user_id: session.user.id,
            video_id: id,
            created_at: new Date().toISOString()
          });
      } catch (err) {
        console.error('Error adding like:', err);
        // Revert on error
        const newLikes = new Set(userLikes);
        newLikes.delete(id);
        setUserLikes(newLikes);
      }
    }
  }, [session, userLikes, toast]);

  // Handle save action
  const handleSave = useCallback(async (id: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to save videos",
        variant: "destructive",
      });
      return;
    }
    
    // Optimistic update
    const currentSaveStatus = userSaves.has(id);
    
    // Update local state
    setVideos(prev => 
      prev.map(video => {
        if (video.id === id) {
          return {
            ...video,
            is_saved: !currentSaveStatus
          };
        }
        return video;
      })
    );
    
    if (currentSaveStatus) {
      // Remove save
      const newSaves = new Set(userSaves);
      newSaves.delete(id);
      setUserSaves(newSaves);
      
      try {
        await supabase
          .from('post_saves')
          .delete()
          .eq('user_id', session.user.id)
          .eq('post_id', id);
      } catch (err) {
        console.error('Error removing save:', err);
        // Revert on error
        const newSaves = new Set(userSaves);
        newSaves.add(id);
        setUserSaves(newSaves);
      }
    } else {
      // Add save
      const newSaves = new Set(userSaves);
      newSaves.add(id);
      setUserSaves(newSaves);
      
      try {
        await supabase
          .from('post_saves')
          .insert({
            user_id: session.user.id,
            post_id: id,
            created_at: new Date().toISOString()
          });
      } catch (err) {
        console.error('Error adding save:', err);
        // Revert on error
        const newSaves = new Set(userSaves);
        newSaves.delete(id);
        setUserSaves(newSaves);
      }
    }
  }, [session, userSaves, toast]);

  // Handle share action
  const handleShare = useCallback(async (id: string) => {
    try {
      // Increment share count in database
      await supabase.rpc('increment_counter', { 
        row_id: id,
        counter_name: 'share_count',
        table_name: 'videos' 
      });
      
      // Update local state
      setVideos(prev => 
        prev.map(video => {
          if (video.id === id) {
            return {
              ...video,
              share_count: video.share_count + 1
            };
          }
          return video;
        })
      );
    } catch (err) {
      console.error('Error incrementing share count:', err);
    }
  }, []);

  // Refresh videos
  const refreshVideos = useCallback(() => {
    loadInitialVideos();
  }, [loadInitialVideos]);

  // Increment view count
  const incrementViewCount = async (videoId: string) => {
    try {
      // Call RPC function to increment view count
      await supabase.rpc('increment_counter', { 
        row_id: videoId,
        counter_name: 'view_count',
        table_name: 'videos'
      });
      
      // Log view in video_views table
      if (session?.user?.id) {
        await supabase.from('video_views').insert({
          video_id: videoId,
          user_id: session.user.id,
          watch_time: 0, // Initial watch time
          created_at: new Date().toISOString()
        });
      }
      
      // Update local state
      setVideos(prev => 
        prev.map(video => {
          if (video.id === videoId) {
            return {
              ...video,
              view_count: video.view_count + 1
            };
          }
          return video;
        })
      );
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  // Effect to load user interactions first
  useEffect(() => {
    fetchUserInteractions();
  }, [fetchUserInteractions]);

  // Effect to load initial videos after user interactions
  useEffect(() => {
    loadInitialVideos();
  }, [loadInitialVideos]);

  // Effect to increment view count when changing videos
  useEffect(() => {
    if (videos.length > 0 && currentIndex >= 0 && currentIndex < videos.length) {
      const currentVideo = videos[currentIndex];
      incrementViewCount(currentVideo.id);
    }
  }, [currentIndex, videos]);

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
    refreshVideos
  };
};

export default useErosFeed;
