
import { useState, useEffect } from 'react';
import { MediaAccessLevel } from '@/utils/media/types';
import { supabase } from '@/integrations/supabase/client';
import { useGhostMode } from './useGhostMode';

interface UseMediaAccessProps {
  creatorId: string;
  postId?: string;
  accessLevel: MediaAccessLevel;
}

export const useMediaAccess = ({ creatorId, postId, accessLevel }: UseMediaAccessProps) => {
  const [canAccess, setCanAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isGhostMode } = useGhostMode();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Ghost mode bypasses all restrictions
        if (isGhostMode) {
          setCanAccess(true);
          setIsLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        
        // Public content is always accessible
        if (accessLevel === MediaAccessLevel.PUBLIC) {
          setCanAccess(true);
          return;
        }

        // Not logged in users can't access restricted content
        if (!user) {
          setCanAccess(false);
          return;
        }

        // Own content is always accessible
        if (user.id === creatorId) {
          setCanAccess(true);
          return;
        }

        // Check subscription status for subscribers-only content
        if (accessLevel === MediaAccessLevel.SUBSCRIBERS) {
          const { data: subscription } = await supabase
            .from('creator_subscriptions')
            .select('id')
            .eq('user_id', user.id)
            .eq('creator_id', creatorId)
            .maybeSingle();
          
          setCanAccess(!!subscription);
          return;
        }

        // Check PPV purchase status
        if (accessLevel === MediaAccessLevel.PPV && postId) {
          const { data: purchase } = await supabase
            .from('post_purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('post_id', postId)
            .maybeSingle();
          
          setCanAccess(!!purchase);
          return;
        }

        // Check follower status
        if (accessLevel === MediaAccessLevel.FOLLOWERS) {
          const { data: follow } = await supabase
            .from('followers')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', creatorId)
            .maybeSingle();
          
          setCanAccess(!!follow);
          return;
        }

        // Private content is only accessible to the creator
        setCanAccess(false);
      } catch (error) {
        console.error('Error checking media access:', error);
        setCanAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [creatorId, postId, accessLevel, isGhostMode]);

  return { canAccess, isLoading };
};
