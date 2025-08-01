/**
 * Critical Performance Hook for Media Loading
 * Solves the 1-2 second delay issue with advanced optimization
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getOptimizedUrl, preloadImages, IMAGE_PRESETS } from '@/utils/media/imageOptimization';

interface MediaOptimizationOptions {
  preload?: boolean;
  priority?: boolean;
  preset?: keyof typeof IMAGE_PRESETS;
  bucket?: string;
}

interface OptimizedMedia {
  url: string;
  isLoaded: boolean;
  hasError: boolean;
  isLoading: boolean;
}

// Global cache for optimized media URLs
const mediaCache = new Map<string, OptimizedMedia>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const useOptimizedMedia = (
  mediaPaths: string | string[],
  options: MediaOptimizationOptions = {}
) => {
  const {
    preload = false,
    priority = false,
    preset = 'post_thumbnail',
    bucket = 'media'
  } = options;

  const paths = Array.isArray(mediaPaths) ? mediaPaths : [mediaPaths];
  const [mediaStates, setMediaStates] = useState<Record<string, OptimizedMedia>>({});

  // Generate optimized URLs with caching
  const optimizedUrls = useMemo(() => {
    return paths.reduce((acc, path) => {
      if (!path) return acc;
      
      const cacheKey = `${bucket}-${path}-${preset}`;
      const cached = mediaCache.get(cacheKey);
      
      if (cached) {
        acc[path] = cached.url;
      } else {
        const optimizedUrl = getOptimizedUrl(path, preset, bucket);
        acc[path] = optimizedUrl;
        
        // Cache the URL
        mediaCache.set(cacheKey, {
          url: optimizedUrl,
          isLoaded: false,
          hasError: false,
          isLoading: false
        });
      }
      
      return acc;
    }, {} as Record<string, string>);
  }, [paths, preset, bucket]);

  // Initialize media states
  useEffect(() => {
    const initialStates = paths.reduce((acc, path) => {
      if (!path) return acc;
      
      acc[path] = {
        url: optimizedUrls[path] || '',
        isLoaded: false,
        hasError: false,
        isLoading: true
      };
      
      return acc;
    }, {} as Record<string, OptimizedMedia>);
    
    setMediaStates(initialStates);
  }, [paths, optimizedUrls]);

  // Preload media for instant display
  useEffect(() => {
    if (!preload && !priority) return;

    const urlsToPreload = Object.values(optimizedUrls);
    
    if (urlsToPreload.length === 0) return;

    const preloadMedia = async () => {
      try {
        await preloadImages(urlsToPreload);
        
        // Update states to mark as loaded
        setMediaStates(prev => {
          const updated = { ...prev };
          paths.forEach(path => {
            if (updated[path]) {
              updated[path] = {
                ...updated[path],
                isLoaded: true,
                isLoading: false
              };
            }
          });
          return updated;
        });
      } catch (error) {
        console.error('Error preloading media:', error);
        
        // Mark as error
        setMediaStates(prev => {
          const updated = { ...prev };
          paths.forEach(path => {
            if (updated[path]) {
              updated[path] = {
                ...updated[path],
                hasError: true,
                isLoading: false
              };
            }
          });
          return updated;
        });
      }
    };

    preloadMedia();
  }, [optimizedUrls, preload, priority, paths]);

  // Handle individual media load events
  const handleMediaLoad = useCallback((path: string) => {
    setMediaStates(prev => ({
      ...prev,
      [path]: {
        ...prev[path],
        isLoaded: true,
        isLoading: false
      }
    }));
  }, []);

  const handleMediaError = useCallback((path: string) => {
    setMediaStates(prev => ({
      ...prev,
      [path]: {
        ...prev[path],
        hasError: true,
        isLoading: false
      }
    }));
  }, []);

  return {
    mediaStates,
    optimizedUrls,
    handleMediaLoad,
    handleMediaError,
    allLoaded: Object.values(mediaStates).every(state => state.isLoaded),
    hasErrors: Object.values(mediaStates).some(state => state.hasError),
    isLoading: Object.values(mediaStates).some(state => state.isLoading)
  };
};

/**
 * Hook for batch loading user avatars - solves N+1 query problem
 */
export const useBatchUserAvatars = (userIds: string[]) => {
  const [avatars, setAvatars] = useState<Record<string, { url: string | null; username: string | null }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userIds.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchBatchAvatars = async () => {
      try {
        const { data, error } = await supabase.rpc('get_user_profiles_batch', {
          user_ids: userIds
        });

        if (!error && data) {
          const avatarMap = data.reduce((acc, profile) => {
            acc[profile.id] = {
              url: profile.avatar_url,
              username: profile.username || profile.display_name
            };
            return acc;
          }, {} as Record<string, { url: string | null; username: string | null }>);

          setAvatars(avatarMap);
        }
      } catch (err) {
        console.error('Error fetching batch avatars:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatchAvatars();
  }, [userIds]);

  return { avatars, isLoading };
};

/**
 * Critical: Clear cache when needed to prevent memory leaks
 */
export const clearMediaCache = () => {
  mediaCache.clear();
};

/**
 * Get cache size for debugging
 */
export const getMediaCacheSize = () => {
  return mediaCache.size;
};