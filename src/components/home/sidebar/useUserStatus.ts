import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserStatus = () => {
  const session = useSession();
  const [isVerifiedCreator, setIsVerifiedCreator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!session?.user?.id) return;
      
      try {
        // Check admin role
        const { data: adminRole, error: adminError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (adminError && adminError.code !== 'PGRST116') {
          console.error("Error checking admin role:", adminError);
          throw adminError;
        }

        if (adminRole) {
          setIsAdmin(true);
          setIsVerifiedCreator(true);
          return;
        }

        // If not admin, check verification status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id_verification_status')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error checking profile status:", profileError);
          throw profileError;
        }

        setIsVerifiedCreator(profile?.id_verification_status === 'verified');

      } catch (error) {
        console.error("Error checking user status:", error);
        // Reset states to default values in case of error
        setIsAdmin(false);
        setIsVerifiedCreator(false);
      }
    };

    checkUserStatus();
  }, [session?.user?.id]);

  return { isAdmin, isVerifiedCreator };
};