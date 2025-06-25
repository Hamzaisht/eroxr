
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserAvatarData {
  url: string | null;
  username: string | null;
}

export const useUserAvatar = (userId?: string | null) => {
  const [avatar, setAvatar] = useState<UserAvatarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setAvatar(null);
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

        if (error) {
          console.error('Error fetching user avatar:', error);
          setAvatar({ url: null, username: null });
        } else {
          setAvatar({
            url: data?.avatar_url || null,
            username: data?.username || null
          });
        }
      } catch (err) {
        console.error('Critical error fetching avatar:', err);
        setAvatar({ url: null, username: null });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAvatar();
  }, [userId]);

  return { avatar, isLoading };
};
