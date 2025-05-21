
// Create this hook if it doesn't exist
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { MediaAccessLevel } from '@/utils/media/types';

interface UseMediaAccessProps {
  creatorId?: string;
  postId?: string;
  accessLevel?: MediaAccessLevel;
}

export function useMediaAccess({
  creatorId,
  postId,
  accessLevel = MediaAccessLevel.PUBLIC
}: UseMediaAccessProps) {
  const session = useSession();
  const [canAccess, setCanAccess] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      
      try {
        // Public content is always accessible
        if (accessLevel === MediaAccessLevel.PUBLIC) {
          setCanAccess(true);
          setReason(null);
          return;
        }
        
        // If not logged in, can't access any non-public content
        const userId = session?.user?.id;
        if (!userId) {
          setCanAccess(false);
          setReason('authentication_required');
          return;
        }
        
        // Owner can always access their own content
        if (creatorId && userId === creatorId) {
          setCanAccess(true);
          setReason(null);
          return;
        }
        
        // For subscriber content, check if user is subscribed to creator
        if (accessLevel === MediaAccessLevel.SUBSCRIBERS) {
          // This would typically involve checking a subscription table
          // Simplified version: assume not subscribed for demo purposes
          setCanAccess(false);
          setReason('subscription_required');
          return;
        }
        
        // For PPV content, check if user has purchased this post
        if (accessLevel === MediaAccessLevel.PPV && postId) {
          // This would typically involve checking a purchases table
          // Simplified version: assume not purchased for demo purposes
          setCanAccess(false);
          setReason('purchase_required');
          return;
        }
        
        // For private content, only creator can access
        if (accessLevel === MediaAccessLevel.PRIVATE) {
          setCanAccess(userId === creatorId);
          setReason(userId === creatorId ? null : 'private_content');
          return;
        }
        
        // Default fallback - deny access
        setCanAccess(false);
        setReason('unknown_restriction');
      } catch (error) {
        console.error('Error checking media access:', error);
        setCanAccess(false);
        setReason('error_checking_access');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [accessLevel, creatorId, postId, session]);
  
  return { canAccess, isLoading, reason };
}
