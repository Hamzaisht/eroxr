import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Centralized cache for user data to prevent duplicate API calls
export const useOptimizedUserData = () => {
  const { user, session } = useAuth();

  // Single query to get all user-related data at once
  const { data, isLoading, error } = useQuery(
    ['user-complete-data', user?.id],
    async () => {
      if (!user?.id) return null;

      try {
        // Fetch all user data in a single optimized query
        const [profileResult, rolesResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .in('role', ['admin', 'super_admin'])
        ]);

        const profile = profileResult.data;
        const roles = rolesResult.data?.map(r => r.role) || [];
        
        const isSuperAdmin = roles.includes('super_admin');
        const isAdmin = roles.includes('admin') || isSuperAdmin;
        const role = isSuperAdmin ? 'super_admin' : (isAdmin ? 'admin' : 'user');

        return {
          profile,
          role,
          isSuperAdmin,
          isAdmin,
          isPremiumUser: role !== 'user' || isSuperAdmin,
          roles
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    },
    {
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2,
    }
  );

  return {
    user,
    session,
    profile: data?.profile || null,
    role: data?.role || 'user',
    isSuperAdmin: data?.isSuperAdmin || false,
    isAdmin: data?.isAdmin || false,
    isPremiumUser: data?.isPremiumUser || false,
    isLoggedIn: !!user && !!session,
    isLoading,
    error,
  };
};