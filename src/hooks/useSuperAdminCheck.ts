import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from "@tanstack/react-query";

export const useSuperAdminCheck = () => {
  const session = useSession();
  
  const { data: isSuperAdmin, isLoading } = useQuery({
    queryKey: ["superAdminCheck", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      
      try {
        // Special case for direct email check for top-level admins
        if (session.user.email === 'hamzaishtiaq242@gmail.com') {
          return true;
        }
        
        // Otherwise check if the user has admin or super_admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .in('role', ['admin', 'super_admin'])
          .maybeSingle();
          
        if (error) {
          console.error("Error checking admin status:", error);
          return false;
        }
        
        return !!data; // Returns true if an admin role was found
      } catch (error) {
        console.error("Error in super admin check:", error);
        return false;
      }
    },
    enabled: !!session?.user?.id,
  });
  
  return {
    isSuperAdmin: !!isSuperAdmin,
    isLoading
  };
};
