
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserModeration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const suspendUser = async (userId: string, reason: string) => {
    setIsLoading(true);
    try {
      console.log('🔒 Admin: Suspending user via RLS-bypass:', userId, reason);
      
      // Use ONLY the RLS-bypass function - crystal clear execution
      const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
        p_user_id: userId,
        p_username: null,
        p_bio: null,
        p_location: null,
        p_avatar_url: null,
        p_banner_url: null,
        p_interests: null,
        p_profile_visibility: null,
        p_status: 'suspended',
      });

      if (rpcError || !result?.success) {
        console.error('❌ Admin: User suspension failed:', rpcError || result?.error);
        throw new Error(rpcError?.message || result?.error || 'Failed to suspend user');
      }

      console.log('✅ Admin: User suspended successfully via RLS-bypass');
      
      toast({
        title: "User Suspended",
        description: `User has been suspended for: ${reason}`,
      });

      return { success: true };
    } catch (error: any) {
      console.error('💥 Admin: User suspension error:', error);
      toast({
        title: "Suspension Failed",
        description: error.message || "Failed to suspend user",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const unsuspendUser = async (userId: string) => {
    setIsLoading(true);
    try {
      console.log('🔒 Admin: Unsuspending user via RLS-bypass:', userId);
      
      // Use ONLY the RLS-bypass function - crystal clear execution
      const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
        p_user_id: userId,
        p_username: null,
        p_bio: null,
        p_location: null,
        p_avatar_url: null,
        p_banner_url: null,
        p_interests: null,
        p_profile_visibility: null,
        p_status: 'online',
      });

      if (rpcError || !result?.success) {
        console.error('❌ Admin: User unsuspension failed:', rpcError || result?.error);
        throw new Error(rpcError?.message || result?.error || 'Failed to unsuspend user');
      }

      console.log('✅ Admin: User unsuspended successfully via RLS-bypass');
      
      toast({
        title: "User Unsuspended",
        description: "User has been unsuspended and can access the platform",
      });

      return { success: true };
    } catch (error: any) {
      console.error('💥 Admin: User unsuspension error:', error);
      toast({
        title: "Unsuspension Failed",
        description: error.message || "Failed to unsuspend user",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suspendUser,
    unsuspendUser,
    isLoading,
  };
};
