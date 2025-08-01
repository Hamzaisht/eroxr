
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserAvatarData {
  url: string | null;
  username: string | null;
}

// In-memory cache to prevent duplicate requests
const avatarCache = new Map<string, { data: UserAvatarData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserAvatar = (userId?: string | null) => {
  const [avatar, setAvatar] = useState<UserAvatarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setAvatar(null);
      return;
    }

    // Check cache first
    const cached = avatarCache.get(userId);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      setAvatar(cached.data);
      return;
    }

    const fetchUserAvatar = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url, username')
          .eq('id', userId)
          .single();

        const avatarData: UserAvatarData = {
          url: data?.avatar_url || null,
          username: data?.username || null
        };

        if (error) {
          console.error('Error fetching user avatar:', error);
        }

        // Cache the result
        avatarCache.set(userId, {
          data: avatarData,
          timestamp: now
        });

        setAvatar(avatarData);
      } catch (err) {
        console.error('Critical error fetching avatar:', err);
        const fallbackData = { url: null, username: null };
        avatarCache.set(userId, {
          data: fallbackData,
          timestamp: now
        });
        setAvatar(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAvatar();
  }, [userId]);

  return { avatar, isLoading };
};

// Utility to preload avatars for a list of user IDs
export const preloadAvatars = async (userIds: string[]) => {
  const uncachedIds = userIds.filter(id => {
    const cached = avatarCache.get(id);
    const now = Date.now();
    return !cached || (now - cached.timestamp) >= CACHE_DURATION;
  });

  if (uncachedIds.length === 0) return;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, avatar_url, username')
      .in('id', uncachedIds);

    if (!error && data) {
      const now = Date.now();
      data.forEach(profile => {
        avatarCache.set(profile.id, {
          data: {
            url: profile.avatar_url,
            username: profile.username
          },
          timestamp: now
        });
      });
    }
  } catch (err) {
    console.error('Error preloading avatars:', err);
  }
};

// Clear cache when needed
export const clearAvatarCache = (userId?: string) => {
  if (userId) {
    avatarCache.delete(userId);
  } else {
    avatarCache.clear();
  }
};
