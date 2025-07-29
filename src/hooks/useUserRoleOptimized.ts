import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = 'user' | 'admin' | 'super_admin';

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: roleData, isLoading } = useQuery(
    ['user-role', user?.id],
    async () => {
      if (!user?.id) {
        return { role: 'user' as UserRole, isSuperAdmin: false };
      }

      try {
        // Single optimized query to get user roles
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'super_admin']);

        if (error) throw error;

        const roles = userRoles?.map(r => r.role) || [];
        const isSuperAdmin = roles.includes('super_admin');
        const isAdmin = roles.includes('admin') || isSuperAdmin;
        
        const role: UserRole = isSuperAdmin ? 'super_admin' : (isAdmin ? 'admin' : 'user');

        return { role, isSuperAdmin };
      } catch (error) {
        console.error('Error fetching user role:', error);
        return { role: 'user' as UserRole, isSuperAdmin: false };
      }
    },
    {
      enabled: !!user?.id,
      staleTime: 10 * 60 * 1000, // 10 minutes - roles don't change often
      cacheTime: 30 * 60 * 1000, // 30 minutes cache
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    }
  );

  const role = roleData?.role || 'user';
  const isSuperAdmin = roleData?.isSuperAdmin || false;
  const isAdmin = role === 'admin' || role === 'super_admin';
  const isPremiumUser = role !== 'user' || isSuperAdmin;

  return {
    role,
    isLoading,
    isSuperAdmin,
    isAdmin,
    isPremiumUser
  };
};