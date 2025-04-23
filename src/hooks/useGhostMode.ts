
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export function useGhostMode() {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    async function checkGhostMode() {
      if (!session?.user?.id) {
        setIsGhostMode(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        const isAdmin = userRoles?.some(role => 
          role.role === 'admin' || role.role === 'super_admin' || role.role === 'moderator'
        );

        if (!isAdmin) {
          setIsGhostMode(false);
          setIsLoading(false);
          return;
        }

        // Check if ghost mode is active for this admin
        const { data: adminSession } = await supabase
          .from('admin_sessions')
          .select('ghost_mode')
          .eq('admin_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setIsGhostMode(adminSession?.ghost_mode || false);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking ghost mode:', error);
        setIsGhostMode(false);
        setIsLoading(false);
      }
    }

    checkGhostMode();
  }, [session]);

  return { isGhostMode, isLoading };
}
