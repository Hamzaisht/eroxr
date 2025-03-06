
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/components/dating/hooks/useUserProfile";
import { BodyContactAccessCheckResult } from "../types";

export const useBodyContactAccess = (): BodyContactAccessCheckResult => {
  const session = useSession();
  const { data: userProfile, isLoading } = useUserProfile();
  const { toast } = useToast();

  // Default result - no access
  const result: BodyContactAccessCheckResult = {
    canAccess: false,
    reasonCodes: [],
    reasonMessages: []
  };

  // Not logged in
  if (!session?.user) {
    result.reasonCodes.push("NOT_LOGGED_IN");
    result.reasonMessages.push("You need to be logged in to access Body Contact features");
    return result;
  }

  // Super admin check (based on email)
  const superAdminEmails = ["hamzaishtiaq242@gmail.com"];
  if (session.user.email && superAdminEmails.includes(session.user.email.toLowerCase())) {
    console.log("Super admin detected, granting full access to Body Contact features");
    result.canAccess = true;
    return result;
  }

  // Still loading profile data
  if (isLoading) {
    result.reasonCodes.push("LOADING");
    result.reasonMessages.push("Verifying your account status...");
    return result;
  }

  // No profile data found
  if (!userProfile) {
    result.reasonCodes.push("PROFILE_NOT_FOUND");
    result.reasonMessages.push("Your profile information could not be found");
    return result;
  }

  // ID verification required - check for both id_verification or selfie verification
  if (userProfile.id_verification_status !== 'verified') {
    result.reasonCodes.push("NOT_VERIFIED");
    result.reasonMessages.push("ID verification or selfie verification required to access Body Contact");
  }

  // Premium subscription required
  if (!userProfile.is_paying_customer) {
    result.reasonCodes.push("NOT_PREMIUM");
    result.reasonMessages.push("Premium subscription required to access Body Contact");
  }

  // If no reason codes were added, user has access
  if (result.reasonCodes.length === 0) {
    result.canAccess = true;
  }

  return result;
};
