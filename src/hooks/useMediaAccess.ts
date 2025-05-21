
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { MediaAccessLevel } from '@/utils/media/types';
import { supabase } from '@/integrations/supabase/client';

interface UseMediaAccessOptions {
  creatorId?: string;
  postId?: string;
  accessLevel?: MediaAccessLevel;
}

interface MediaAccessStatus {
  canAccess: boolean;
  isLoading: boolean;
  error: string | null;
  reason?: string;
}

export function useMediaAccess({ 
  creatorId, 
  postId, 
  accessLevel = MediaAccessLevel.PUBLIC 
}: UseMediaAccessOptions): MediaAccessStatus {
  const session = useSession();
  const [accessStatus, setAccessStatus] = useState<MediaAccessStatus>({
    canAccess: accessLevel === MediaAccessLevel.PUBLIC,
    isLoading: accessLevel !== MediaAccessLevel.PUBLIC,
    error: null
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        if (error) throw error;
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [session]);
  
  useEffect(() => {
    // Public content is always accessible
    if (accessLevel === MediaAccessLevel.PUBLIC) {
      setAccessStatus({
        canAccess: true,
        isLoading: false,
        error: null
      });
      return;
    }
    
    // If not authenticated, can't access non-public content
    if (!session?.user) {
      setAccessStatus({
        canAccess: false,
        isLoading: false,
        error: "Authentication required",
        reason: "authentication-required"
      });
      return;
    }
    
    // Admins can access all content
    if (isAdmin) {
      setAccessStatus({
        canAccess: true,
        isLoading: false,
        error: null
      });
      return;
    }
    
    // Content owner can always access their own content
    if (creatorId && session.user.id === creatorId) {
      setAccessStatus({
        canAccess: true,
        isLoading: false,
        error: null
      });
      return;
    }
    
    const checkAccess = async () => {
      try {
        // For followers-only content
        if (accessLevel === MediaAccessLevel.FOLLOWERS && creatorId) {
          const { data, error } = await supabase
            .from('followers')
            .select('id')
            .eq('follower_id', session.user.id)
            .eq('following_id', creatorId)
            .single();
            
          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            throw error;
          }
          
          setAccessStatus({
            canAccess: !!data,
            isLoading: false,
            error: null,
            reason: data ? undefined : 'followers-only'
          });
          return;
        }
        
        // For subscribers-only content
        if (accessLevel === MediaAccessLevel.SUBSCRIBERS && creatorId) {
          const { data, error } = await supabase
            .from('creator_subscriptions')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('creator_id', creatorId)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          setAccessStatus({
            canAccess: !!data,
            isLoading: false,
            error: null,
            reason: data ? undefined : 'subscribers-only'
          });
          return;
        }
        
        // For PPV content
        if (accessLevel === MediaAccessLevel.PPV && postId) {
          const { data, error } = await supabase
            .from('post_purchases')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('post_id', postId)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          setAccessStatus({
            canAccess: !!data,
            isLoading: false,
            error: null,
            reason: data ? undefined : 'ppv'
          });
          return;
        }
        
        // Private content is only accessible by the owner (already checked above)
        if (accessLevel === MediaAccessLevel.PRIVATE) {
          setAccessStatus({
            canAccess: false, // We already checked creator_id match above
            isLoading: false,
            error: "This content is private",
            reason: 'private'
          });
          return;
        }
        
      } catch (error: any) {
        setAccessStatus({
          canAccess: false,
          isLoading: false,
          error: error.message || "Failed to check access permissions",
          reason: 'error'
        });
      }
    };
    
    checkAccess();
  }, [session, creatorId, postId, accessLevel, isAdmin]);
  
  return accessStatus;
}
