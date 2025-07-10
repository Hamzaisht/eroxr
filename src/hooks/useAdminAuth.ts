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
          .in('role', ['admin', 'super_admin'])
          .single();

        if (error || !data) {
          setIsAdmin(false);
          setAdminUser(null);
        } else {
          setIsAdmin(true);
          setAdminUser({
            id: user.id,
            email: user.email || '',
            role: data.role as 'admin' | 'super_admin',
            permissions: data.role === 'super_admin' ? ['all'] : ['moderate', 'view']
          });
        }
      } catch (err) {
        console.error('Admin auth check failed:', err);
        setIsAdmin(false);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  return { isAdmin, adminUser, isLoading };
};