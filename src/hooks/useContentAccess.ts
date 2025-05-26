
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { MediaAccessLevel } from '@/utils/media/types';
import { getAccessDeniedReason, AccessCheckResult } from '@/utils/media/accessControl';
import { useGhostMode } from './useGhostMode';

interface UseContentAccessProps {
  creatorId: string;
  contentId?: string;
  accessLevel: MediaAccessLevel;
  ppvAmount?: number;
}

export const useContentAccess = ({
  creatorId,
  contentId,
  accessLevel,
  ppvAmount
}: UseContentAccessProps) => {
  const [accessResult, setAccessResult] = useState<AccessCheckResult>({ canAccess: false });
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const { isGhostMode } = useGhostMode();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const isLoggedIn = !!session?.user;
        const isOwner = session?.user?.id === creatorId;

        // Ghost mode bypasses all restrictions
        if (isGhostMode) {
          setAccessResult({ canAccess: true });
          return;
        }

        // Initialize access flags
        let isSubscriber = false;
        let hasPurchased = false;
        let isFollower = false;

        if (isLoggedIn && !isOwner) {
          // Check subscription status
          if (accessLevel === MediaAccessLevel.SUBSCRIBERS) {
            const { data: subscription } = await supabase
              .from('creator_subscriptions')
              .select('id')
              .eq('user_id', session.user.id)
              .eq('creator_id', creatorId)
              .single();
            
            isSubscriber = !!subscription;
          }

          // Check PPV purchase status
          if (accessLevel === MediaAccessLevel.PPV && contentId) {
            const { data: purchase } = await supabase
              .from('post_purchases')
              .select('id')
              .eq('user_id', session.user.id)
              .eq('post_id', contentId)
              .single();
            
            hasPurchased = !!purchase;
          }

          // Check follower status
          if (accessLevel === MediaAccessLevel.FOLLOWERS) {
            const { data: follow } = await supabase
              .from('followers')
              .select('id')
              .eq('follower_id', session.user.id)
              .eq('following_id', creatorId)
              .single();
            
            isFollower = !!follow;
          }
        }

        const result = getAccessDeniedReason(
          accessLevel,
          isLoggedIn,
          isOwner,
          isSubscriber,
          hasPurchased,
          isFollower
        );

        setAccessResult(result);
      } catch (error) {
        console.error('Error checking content access:', error);
        setAccessResult({ canAccess: false, reason: 'login' });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [creatorId, contentId, accessLevel, session, isGhostMode]);

  const handleSubscribe = async () => {
    if (!session?.user) return;
    
    try {
      const { error } = await supabase
        .from('creator_subscriptions')
        .insert({
          user_id: session.user.id,
          creator_id: creatorId
        });

      if (!error) {
        // Refresh access check
        setIsLoading(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const handlePurchase = async () => {
    if (!session?.user || !contentId || !ppvAmount) return;
    
    try {
      const { error } = await supabase
        .from('post_purchases')
        .insert({
          user_id: session.user.id,
          post_id: contentId,
          amount: ppvAmount
        });

      if (!error) {
        // Refresh access check
        setIsLoading(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  const handleFollow = async () => {
    if (!session?.user) return;
    
    try {
      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: session.user.id,
          following_id: creatorId
        });

      if (!error) {
        // Refresh access check
        setIsLoading(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  return {
    ...accessResult,
    isLoading,
    ppvAmount,
    actions: {
      subscribe: handleSubscribe,
      purchase: handlePurchase,
      follow: handleFollow
    }
  };
};
