
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface PermissionCheckResult {
  isAllowed: boolean;
  error?: string;
}

export const useAdPermissionCheck = () => {
  const session = useSession();

  const checkPermissions = async (isSuperAdmin: boolean): Promise<PermissionCheckResult> => {
    if (!session?.user?.id) {
      return { isAllowed: false, error: "You need to be logged in to create a body contact ad" };
    }

    // Skip checks for super admin
    if (isSuperAdmin) {
      console.log("Super admin detected - bypassing verification and premium checks");
      return { isAllowed: true };
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("is_paying_customer, id_verification_status")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      if (!profileData.is_paying_customer) {
        return { 
          isAllowed: false, 
          error: "You need a premium subscription to create body contact ads" 
        };
      }

      if (profileData.id_verification_status !== 'verified') {
        return { 
          isAllowed: false, 
          error: "You need to verify your ID to create body contact ads" 
        };
      }

      return { isAllowed: true };
    } catch (error: any) {
      console.error("Permission check error:", error);
      return { isAllowed: false, error: error.message || "Failed to check permissions" };
    }
  };

  return { checkPermissions };
};
