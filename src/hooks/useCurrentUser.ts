
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profile";

export const useCurrentUser = () => {
  const { user, session, loading: authLoading } = useAuth();

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['current-user-profile', user?.id],
    queryFn: async () => {
      console.log('useCurrentUser - Fetching profile for user:', user?.id);
      
      if (!user?.id) {
        console.log('useCurrentUser - No user ID, returning null');
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('useCurrentUser - Error fetching profile:', error);
        throw error;
      }
      
      console.log('useCurrentUser - Profile fetched successfully:', data);
      return data as Profile;
    },
    enabled: !!user?.id && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    user,
    session,
    profile,
    isLoggedIn: !!user && !!session,
    isLoading: authLoading || (!!user && profileLoading),
    error: profileError,
  };
};
