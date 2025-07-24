
import { QuickMatch } from "../QuickMatch";
import { ProfileCompletionPrompt } from "../ProfileCompletionPrompt";
import { EmptyProfilesState } from "../EmptyProfilesState";
import { DatingAd } from "@/types/dating";

interface QuickMatchTabProps {
  ads: DatingAd[] | undefined;
  isLoading: boolean;
  userProfile: DatingAd | null;
  session: any;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
}

export function QuickMatchTab({
  ads,
  isLoading,
  userProfile,
  session,
  canAccessBodyContact,
  onAdCreationSuccess,
}: QuickMatchTabProps) {
  const hasAds = ads && ads.length > 0;
  return hasAds || isLoading ? (
    <>
      {session && userProfile && <ProfileCompletionPrompt />}
      <QuickMatch ads={ads || []} userProfile={userProfile} />
    </>
  ) : (
    <EmptyProfilesState 
      canAccessBodyContact={canAccessBodyContact}
      onAdCreationSuccess={onAdCreationSuccess}
    />
  );
}

export default QuickMatchTab;
