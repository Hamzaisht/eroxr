
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface ShortVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
  description: string;
  hasLiked: boolean;
  hasSaved: boolean;
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  creator: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  createdAt: string;
}

interface UseShortsPaginationOptions {
  initialShortId?: string | null;
  pageSize?: number;
}

export const useShortsPagination = ({
  initialShortId = null,
  pageSize = 10
}: UseShortsPaginationOptions = {}) => {
  const [shorts, setShorts] = useState<ShortVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  
  // Function to load shorts
  const loadShorts = useCallback(async (cursor: string | null = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, if we have an initialShortId, load that specific short
      if (initialShortId && !cursor) {
        const { data: specificShort, error: specificError } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            content_extended,
            video_urls,
            video_thumbnail_url,
            created_at,
            likes_count,
            comments_count,
            view_count,
            creator_id,
            profiles:creator_id (
              id,
              username,
              avatar_url
            )
          `)
          .eq('id', initialShortId)
          .eq('visibility', 'public')
          .single();
        
        if (specificError) {
          console.error("Error fetching specific short:", specificError);
          
          // If the specific short isn't found, just proceed to load regular shorts
        } else if (specificShort) {
          // Check if user has liked this post
          let hasLiked = false;
          if (session?.user?.id) {
            const { data: likeData } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', specificShort.id)
              .eq('user_id', session.user.id)
              .maybeSingle();
              
            hasLiked = !!likeData;
          }
          
          // Check if user has saved this post
          let hasSaved = false;
          if (session?.user?.id) {
            const { data: saveData } = await supabase
              .from('post_saves')
              .select('id')
              .eq('post_id', specificShort.id)
              .eq('user_id', session.user.id)
              .maybeSingle();
              
            hasSaved = !!saveData;
          }
          
          // Transform to our format
          const transformedShort: ShortVideo = {
            id: specificShort.id,
            url: specificShort.video_urls?.[0] || '',
            thumbnailUrl: specificShort.video_thumbnail_url || '',
            description: specificShort.content || specificShort.content_extended || '',
            hasLiked,
            hasSaved,
            stats: {
              likes: specificShort.likes_count || 0,
              comments: specificShort.comments_count || 0,
              views: specificShort.view_count || 0
            },
            creator: {
              id: specificShort.creator_id,
              username: specificShort.profiles?.[0]?.username || 'Anonymous',
              avatarUrl: specificShort.profiles?.[0]?.avatar_url || ''
            },
            createdAt: specificShort.created_at
          };
          
          setShorts([transformedShort]);
          setCurrentIndex(0);
          setLastId(transformedShort.id);
          setHasMore(true);
          setIsLoading(false);
          return;
        }
      }
      
      // Build the query
      let query = supabase
        .from('posts')
        .select(`
          id,
          content,
          content_extended,
          video_urls,
          video_thumbnail_url,
          created_at,
          likes_count,
          comments_count,
          view_count,
          creator_id,
          profiles:creator_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(pageSize);
      
      // If we have a cursor, use it for pagination
      if (cursor) {
        query = query.lt('id', cursor);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (!data || data.length === 0) {
        setHasMore(false);
        
        // If this is the initial load and no shorts found
        if (!cursor && shorts.length === 0) {
          setIsLoading(false);
        }
        
        return;
      }
      
      // Process the shorts data
      const shortsPromises = data.map(async (short) => {
        // Check if user has liked this post
        let hasLiked = false;
        if (session?.user?.id) {
          const { data: likeData } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', short.id)
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          hasLiked = !!likeData;
        }
        
        // Check if user has saved this post
        let hasSaved = false;
        if (session?.user?.id) {
          const { data: saveData } = await supabase
            .from('post_saves')
            .select('id')
            .eq('post_id', short.id)
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          hasSaved = !!saveData;
        }
        
        return {
          id: short.id,
          url: short.video_urls?.[0] || '',
          thumbnailUrl: short.video_thumbnail_url || '',
          description: short.content || short.content_extended || '',
          hasLiked,
          hasSaved,
          stats: {
            likes: short.likes_count || 0,
            comments: short.comments_count || 0,
            views: short.view_count || 0
          },
          creator: {
            id: short.creator_id,
            username: short.profiles?.[0]?.username || 'Anonymous',
            avatarUrl: short.profiles?.[0]?.avatar_url || ''
          },
          createdAt: short.created_at
        };
      });
      
      const processedShorts = await Promise.all(shortsPromises);
      
      // Update the state
      if (cursor) {
        setShorts(prev => [...prev, ...processedShorts]);
      } else {
        setShorts(processedShorts);
        setCurrentIndex(0);
      }
      
      setLastId(data[data.length - 1]?.id);
    } catch (err: any) {
      console.error('Error loading shorts:', err);
      setError(err.message || 'Failed to load shorts');
      
      toast({
        title: 'Error',
        description: 'Failed to load videos. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [initialShortId, pageSize, session?.user?.id, toast, shorts.length]);
  
  // Initial load
  useEffect(() => {
    loadShorts();
  }, [loadShorts]);
  
  // Load more shorts
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && lastId) {
      loadShorts(lastId);
    }
  }, [isLoading, hasMore, lastId, loadShorts]);
  
  // Refresh shorts
  const refresh = useCallback(() => {
    setShorts([]);
    setLastId(null);
    setHasMore(true);
    loadShorts();
  }, [loadShorts]);
  
  // Handle like
  const handleLike = useCallback(async (shortId: string) => {
    if (!session?.user?.id) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like videos',
        variant: 'destructive',
      });
      return;
    }
    
    // Find the short in our state
    const shortIndex = shorts.findIndex(s => s.id === shortId);
    if (shortIndex === -1) return;
    
    const short = shorts[shortIndex];
    
    try {
      if (short.hasLiked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', shortId)
          .eq('user_id', session.user.id);
          
        setShorts(prev => prev.map(s => 
          s.id === shortId 
            ? { 
                ...s, 
                hasLiked: false,
                stats: { ...s.stats, likes: Math.max(0, s.stats.likes - 1) }
              } 
            : s
        ));
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({
            post_id: shortId,
            user_id: session.user.id
          });
          
        setShorts(prev => prev.map(s => 
          s.id === shortId 
            ? { 
                ...s, 
                hasLiked: true,
                stats: { ...s.stats, likes: s.stats.likes + 1 }
              } 
            : s
        ));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      toast({
        title: 'Action failed',
        description: 'Could not process your request',
        variant: 'destructive',
      });
    }
  }, [session, shorts, toast]);
  
  // Handle save
  const handleSave = useCallback(async (shortId: string) => {
    if (!session?.user?.id) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save videos',
        variant: 'destructive',
      });
      return;
    }
    
    // Find the short in our state
    const shortIndex = shorts.findIndex(s => s.id === shortId);
    if (shortIndex === -1) return;
    
    const short = shorts[shortIndex];
    
    try {
      if (short.hasSaved) {
        // Unsave
        await supabase
          .from('post_saves')
          .delete()
          .eq('post_id', shortId)
          .eq('user_id', session.user.id);
          
        setShorts(prev => prev.map(s => 
          s.id === shortId ? { ...s, hasSaved: false } : s
        ));
        
        toast({
          title: 'Removed from saved',
          description: 'Video removed from your saved items',
        });
      } else {
        // Save
        await supabase
          .from('post_saves')
          .insert({
            post_id: shortId,
            user_id: session.user.id
          });
          
        setShorts(prev => prev.map(s => 
          s.id === shortId ? { ...s, hasSaved: true } : s
        ));
        
        toast({
          title: 'Saved',
          description: 'Video saved to your collection',
        });
      }
    } catch (err) {
      console.error('Error toggling save:', err);
      toast({
        title: 'Action failed',
        description: 'Could not process your request',
        variant: 'destructive',
      });
    }
  }, [session, shorts, toast]);
  
  // Handle share
  const handleShare = useCallback((shortId: string) => {
    try {
      const shareUrl = `${window.location.origin}/shorts/${shortId}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Check out this short video',
          url: shareUrl
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: 'Link copied',
          description: 'Video link copied to clipboard',
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast({
        title: 'Share failed',
        description: 'Could not share the video',
        variant: 'destructive',
      });
    }
  }, [toast]);
  
  return {
    shorts,
    currentIndex,
    setCurrentIndex,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    handleLike,
    handleSave,
    handleShare
  };
};
