
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export function useSuperAdminCheck() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!session) {
        setIsSuperAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) throw error;
        
        // Check if the user has the super_admin role
        setIsSuperAdmin(data?.role === 'super_admin');
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsSuperAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [session]);

  return { isSuperAdmin, isLoading };
}
