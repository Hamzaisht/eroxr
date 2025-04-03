
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
        console.log("No session found, cannot check admin status");
        setIsSuperAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Detailed logging for debugging
        console.log("Checking admin status for user:", {
          userId: session.user.id,
          email: session.user.email,
          userMetadata: session.user.user_metadata
        });
        
        // Check if this is the god mode email directly
        if (session.user.email === "hamzaishtiaq242@gmail.com") {
          console.log("🔑 God mode admin detected directly by email");
          setIsSuperAdmin(true);
          setIsLoading(false);
          return;
        }
        
        // Check user_roles table
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        console.log("Roles query result:", { rolesData, rolesError });
        
        if (rolesError) {
          console.warn("Error checking admin role:", rolesError);
          // Fallback to user metadata
          const metadataRole = session.user.user_metadata?.role;
          console.log("Fallback - Metadata role:", metadataRole);
          
          setIsSuperAdmin(metadataRole === "super_admin");
        } else {
          // Check if the user has the super_admin role
          const isAdmin = rolesData?.role === 'super_admin';
          console.log(`🕵️ Admin role check result: ${isAdmin ? '✅ ADMIN' : '❌ NOT ADMIN'}`, rolesData);
          setIsSuperAdmin(isAdmin);
        }
      } catch (error) {
        console.error("Unexpected error checking admin role:", error);
        setIsSuperAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [session]);

  return { isSuperAdmin, isLoading };
}
