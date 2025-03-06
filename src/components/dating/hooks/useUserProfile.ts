
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  is_paying_customer: boolean;
  id_verification_status: string;
}

export const useUserProfile = () => {
  const session = useSession();

  return useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_paying_customer, id_verification_status')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!session?.user?.id,
  });
};
