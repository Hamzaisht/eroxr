
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
        // Check if the user has super_admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'super_admin')
          .maybeSingle();
          
        if (error) {
          console.error("Error checking admin status:", error);
          return false;
        }
        
        return !!data; // Returns true if a super_admin role was found
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
