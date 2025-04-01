
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
        // Check if user is a super admin by email directly (failsafe method)
        const superAdminEmails = ["hamzaishtiaq242@gmail.com"]; // This is the god mode account
        if (session.user.email && superAdminEmails.includes(session.user.email.toLowerCase())) {
          console.log("God mode detected via email");
          return true;
        }
        
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
