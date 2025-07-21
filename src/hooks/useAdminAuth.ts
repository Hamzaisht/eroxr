import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
}

export const useAdminAuth = () => {
  const user = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        setAdminUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'super_admin']);

        if (error || !data || data.length === 0) {
          setIsAdmin(false);
          setAdminUser(null);
        } else {
          // Check for highest privilege role
          const roles = data.map(r => r.role);
          const highestRole = roles.includes('super_admin') ? 'super_admin' : 'admin';
          
          setIsAdmin(true);
          setAdminUser({
            id: user.id,
            email: user.email || '',
            role: highestRole,
            permissions: highestRole === 'super_admin' ? ['all'] : ['moderate', 'view']
          });
        }
      } catch (err) {
        setIsAdmin(false);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Only check once per user change
    if (user?.id) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setAdminUser(null);
      setIsLoading(false);
    }
  }, [user?.id]);

  return { isAdmin, adminUser, isLoading };
};