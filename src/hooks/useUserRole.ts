import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from './useCurrentUser';

export type UserRole = 'user' | 'admin' | 'super_admin';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useCurrentUser();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) {
        setRole('user');
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is super admin
        const { data: isSuperAdmin } = await supabase
          .rpc('is_super_admin', { user_id: user.id });

        if (isSuperAdmin) {
          setRole('super_admin');
        } else {
          // Check other roles
          const { data: userRole } = await supabase
            .rpc('get_user_role', { user_id: user.id });
          
          setRole(userRole as UserRole || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.id]);

  const isSuperAdmin = role === 'super_admin';
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