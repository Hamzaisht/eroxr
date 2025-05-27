
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserAvatar {
  id: string;
  url: string;
  storage_path: string;
  created_at: string;
}

export const useUserAvatar = (userId?: string | null) => {
  const [avatar, setAvatar] = useState<UserAvatar | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setAvatar(null);
      return;
    }

    const fetchAvatar = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Query for the most recent avatar using the correct fields
        const { data, error: queryError } = await supabase
          .from('media_assets')
          .select('id, storage_path, created_at')
          .eq('user_id', userId)
          .eq('media_type', 'image')
          .contains('metadata', { usage: 'avatar' })
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (queryError) {
          throw queryError;
        }

        if (data) {
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(data.storage_path);

          setAvatar({
            id: data.id,
            url: publicUrl,
            storage_path: data.storage_path,
            created_at: data.created_at
          });
        } else {
          setAvatar(null);
        }
      } catch (err: any) {
        setError(err.message);
        setAvatar(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatar();
  }, [userId]);

  const refreshAvatar = async () => {
    if (userId) {
      const fetchAvatar = async () => {
        try {
          const { data, error: queryError } = await supabase
            .from('media_assets')
            .select('id, storage_path, created_at')
            .eq('user_id', userId)
            .eq('media_type', 'image')
            .contains('metadata', { usage: 'avatar' })
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (queryError) {
            throw queryError;
          }

          if (data) {
            const { data: { publicUrl } } = supabase.storage
              .from('media')
              .getPublicUrl(data.storage_path);

            setAvatar({
              id: data.id,
              url: publicUrl,
              storage_path: data.storage_path,
              created_at: data.created_at
            });
          } else {
            setAvatar(null);
          }
        } catch (err: any) {
          setError(err.message);
          setAvatar(null);
        }
      };

      await fetchAvatar();
    }
  };

  return {
    avatar,
    isLoading,
    error,
    refreshAvatar
  };
};
