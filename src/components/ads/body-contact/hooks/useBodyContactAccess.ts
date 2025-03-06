
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

  console.log("User profile for access check:", userProfile);

  // Check for either verification OR premium status - either is sufficient
  let hasVerification = userProfile.id_verification_status === 'verified';
  let hasPremium = userProfile.is_paying_customer;
  
  // If user is either verified OR premium, they can access
  if (hasVerification && hasPremium) {
    // User has both requirements - full access
    result.canAccess = true;
    return result;
  }
  
  // User needs at least one of the requirements
  if (!hasVerification) {
    result.reasonCodes.push("NOT_VERIFIED");
    result.reasonMessages.push("ID verification or selfie verification required to access Body Contact");
  }

  if (!hasPremium) {
    result.reasonCodes.push("NOT_PREMIUM");
    result.reasonMessages.push("Premium subscription required to access Body Contact");
  }

  // If user has at least verification OR premium, grant access
  if (hasVerification || hasPremium) {
    result.canAccess = true;
  }

  return result;
};
