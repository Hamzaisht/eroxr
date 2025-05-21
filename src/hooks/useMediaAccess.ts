
import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { MediaAccessLevel } from '@/utils/media/types';

interface UseMediaAccessProps {
  creatorId?: string;
  postId?: string;
  accessLevel?: MediaAccessLevel;
}

export const useMediaAccess = ({
  creatorId,
  postId,
  accessLevel = MediaAccessLevel.PUBLIC
}: UseMediaAccessProps) => {
  const [canAccess, setCanAccess] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  
  const session = useSession();
  const currentUserId = session?.user?.id;
  
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
        
        // Content owners can always access their content
        if (creatorId && currentUserId === creatorId) {
          setCanAccess(true);
          setReason(null);
          return;
        }
        
        // If not public and user is not the owner, they need to authenticate
        if (!currentUserId) {
          setCanAccess(false);
          setReason('authentication_required');
          return;
        }
        
        // For private content, only the creator can access it
        if (accessLevel === MediaAccessLevel.PRIVATE) {
          setCanAccess(currentUserId === creatorId);
          setReason(currentUserId === creatorId ? null : 'private_content');
          return;
        }
        
        // For subscriber content, check if the user is subscribed to the creator
        if (accessLevel === MediaAccessLevel.SUBSCRIBER) {
          // In a real app, you would check subscription status here
          // For now, we'll assume they can access if they're authenticated
          setCanAccess(true);
          setReason(null);
          return;
        }
        
        // For paid content, check if the user has purchased the content
        if (accessLevel === MediaAccessLevel.PAID && postId) {
          // In a real app, you would check purchase records here
          // For now, we'll assume they can access if they're authenticated
          setCanAccess(true);
          setReason(null);
          return;
        }
        
        // Default case: allow access
        setCanAccess(true);
        setReason(null);
      } catch (error) {
        console.error('Error checking media access:', error);
        setCanAccess(false);
        setReason('error');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [accessLevel, creatorId, currentUserId, postId]);
  
  return {
    canAccess,
    isLoading,
    reason,
    isOwner: creatorId === currentUserId
  };
};
