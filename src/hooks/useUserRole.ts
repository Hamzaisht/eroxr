import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const useUserRole = () => {
  const session = useSession();

  return useQuery({
    queryKey: ["userRole", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user role:", error);
        throw error;
      }

      return data?.role || 'user'; // Default to 'user' if no role found
    },
    enabled: !!session?.user?.id,
  });
};