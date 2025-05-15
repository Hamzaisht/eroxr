
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface PermissionCheckResult {
  isAllowed: boolean;
  error?: string;
}

export const useAdPermissionCheck = () => {
  const session = useSession();

  const checkPermissions = async (userId: string, isSuperAdmin?: boolean): Promise<PermissionCheckResult> => {
    if (!userId) {
      return { isAllowed: false, error: "You need to be logged in to create a body contact ad" };
    }

    // Skip checks for super admin
    if (isSuperAdmin === true) {
      console.log("Super admin detected - bypassing verification and premium checks");
      return { isAllowed: true };
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("is_paying_customer, id_verification_status")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      // Check if user is either premium OR verified (not necessarily both)
      const isPremium = profileData.is_paying_customer;
      const isVerified = profileData.id_verification_status === 'verified';

      console.log("User permission check:", { isPremium, isVerified });

      // Either premium OR verification is sufficient
      if (!isPremium && !isVerified) {
        return { 
          isAllowed: false, 
          error: "You need either a premium subscription or ID verification to create body contact ads" 
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
