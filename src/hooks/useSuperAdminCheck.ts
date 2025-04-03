
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
        
        // Check if this is the god mode email directly
        if (session.user.email === "hamzaishtiaq242@gmail.com") {
          console.log("God mode admin detected directly by email");
          setIsSuperAdmin(true);
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) {
          console.warn("Error checking admin role:", error);
          // Despite error, check user metadata as fallback
          if (session.user.user_metadata?.role === "super_admin") {
            console.log("Admin role found in user metadata");
            setIsSuperAdmin(true);
          } else {
            setIsSuperAdmin(false);
          }
        } else {
          // Check if the user has the super_admin role
          setIsSuperAdmin(data?.role === 'super_admin');
          console.log("Admin role check result:", data?.role === 'super_admin', data);
        }
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
