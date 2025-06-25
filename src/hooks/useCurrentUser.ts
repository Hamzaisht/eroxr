
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profile";

export const useCurrentUser = () => {
  const { user, session, loading: authLoading } = useAuth();

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery(
    ['current-user-profile', user?.id],
    async () => {
      console.log('👤 useCurrentUser - Fetching profile for user:', user?.id);
      
      if (!user?.id) {
        console.log('👤 useCurrentUser - No user ID, returning null');
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle to handle no results gracefully
      
      if (error) {
        console.error('❌ useCurrentUser - Error fetching profile:', error);
        throw error;
      }
      
      console.log('✅ useCurrentUser - Profile fetched successfully:', {
        hasProfile: !!data,
        username: data?.username,
        profileId: data?.id
      });
      
      return data as Profile | null;
    },
    {
      enabled: !!user?.id && !authLoading,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2, // Reduced retry attempts for faster failure
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    }
  );

  return {
    user,
    session,
    profile,
    isLoggedIn: !!user && !!session,
    isLoading: authLoading || (!!user && profileLoading),
    error: profileError,
  };
};
