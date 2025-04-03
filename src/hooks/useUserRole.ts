
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const useUserRole = () => {
  const session = useSession();

  return useQuery({
    queryKey: ["userRole", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error fetching user roles:", error);
          throw error;
        }

        // If no roles found, default to 'user'
        if (!data || data.length === 0) {
          return 'user';
        }

        // Check for the highest privilege role
        // Priority: super_admin > admin > moderator > user
        const roles = data.map(r => r.role);
        
        if (roles.includes('super_admin')) return 'super_admin';
        if (roles.includes('admin')) return 'admin';
        if (roles.includes('moderator')) return 'moderator';
        
        return 'user';
      } catch (error) {
        console.error("Error in useUserRole:", error);
        return 'user'; // Default to 'user' on error
      }
    },
    enabled: !!session?.user?.id,
  });
};
