import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/integrations/supabase/types/profile";

interface UserBadgeProps {
  profile: Profile | null;
  fallbackEmail?: string;
}

export const UserBadge = ({ profile, fallbackEmail }: UserBadgeProps) => {
  const getUserType = () => {
    if (!profile) return "Guest";
    if (profile.id_verification_status === "verified" && profile.is_paying_customer) {
      return "Verified Creator • Premium";
    }
    if (profile.is_paying_customer) {
      return "Premium User";
    }
    return "Free User";
  };

  const displayName = profile?.username || fallbackEmail?.split('@')[0] || 'Guest';

  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="text-sm font-medium text-foreground">
        @{displayName}
      </span>
      <Badge 
        variant={profile?.is_paying_customer ? "default" : "secondary"}
        className="text-[10px] px-2 py-0 h-4 whitespace-nowrap"
      >
        {getUserType()}
      </Badge>
    </div>
  );
};