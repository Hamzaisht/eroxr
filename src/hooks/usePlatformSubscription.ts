
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface PlatformSubscriptionStatus {
  hasPremium: boolean;
  status: string;
  currentPeriodEnd?: string;
}

export const usePlatformSubscription = () => {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscriptionStatus, isLoading, refetch } = useQuery({
    queryKey: ['platform-subscription', user?.id],
    queryFn: async () => {
      if (!user) {
        return { hasPremium: false, status: 'inactive' };
      }

      // Check if user is super admin first
      try {
        const { data: isSuperAdmin } = await supabase
          .rpc('is_super_admin', { user_id: user.id });
        
        if (isSuperAdmin) {
          return { hasPremium: true, status: 'active' };
        }
      } catch (error) {
        console.error('Error checking super admin status:', error);
      }

      const { data, error } = await supabase.functions.invoke('check-platform-subscription');
      
      if (error) {
        console.error('Error checking platform subscription:', error);
        return { hasPremium: false, status: 'inactive' };
      }

      return data as PlatformSubscriptionStatus;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  const createPlatformSubscription = async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user is super admin
    try {
      const { data: isSuperAdmin } = await supabase
        .rpc('is_super_admin', { user_id: user.id });
      
      if (isSuperAdmin) {
        return { success: true, message: 'Super admin has full access' };
      }
    } catch (error) {
      console.error('Error checking super admin status:', error);
    }

    const { data, error } = await supabase.functions.invoke('create-platform-subscription');
    
    if (error) {
      throw new Error(error.message);
    }

    if (data?.url) {
      window.open(data.url, '_blank');
    }

    return data;
  };

  const refreshSubscription = () => {
    queryClient.invalidateQueries({ queryKey: ['platform-subscription'] });
    refetch();
  };

  return {
    hasPremium: subscriptionStatus?.hasPremium || false,
    status: subscriptionStatus?.status || 'inactive',
    currentPeriodEnd: subscriptionStatus?.currentPeriodEnd,
    isLoading,
    createPlatformSubscription,
    refreshSubscription,
  };
};
