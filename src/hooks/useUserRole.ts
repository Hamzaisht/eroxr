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
        // Check if user is super admin first
        const { data: isSuperAdmin, error: superAdminError } = await supabase
          .rpc('is_super_admin', { user_id: user.id });

        if (superAdminError) {
          console.error('Error checking super admin status:', superAdminError);
        }

        if (isSuperAdmin) {
          setRole('super_admin');
        } else {
          // Check admin/super_admin roles from user_roles table
          const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .in('role', ['admin', 'super_admin']);

          if (rolesError) {
            console.error('Error fetching user roles:', rolesError);
            setRole('user');
          } else if (roles && roles.length > 0) {
            // If user has super_admin role, prioritize it
            const hasSuperAdmin = roles.some(r => r.role === 'super_admin');
            const hasAdmin = roles.some(r => r.role === 'admin');
            
            if (hasSuperAdmin) {
              setRole('super_admin');
            } else if (hasAdmin) {
              setRole('admin');
            } else {
              setRole('user');
            }
          } else {
            setRole('user');
          }
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