
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profile";

export const useCurrentUser = () => {
  const session = useSession();
  const user = session?.user;

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['current-user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      return data as Profile;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    session,
    profile,
    isLoggedIn: !!user,
    isLoading: profileLoading,
    error: profileError,
  };
};
