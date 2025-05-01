
import { Button } from "@/components/ui/button";
import type { ProfileHeaderProps } from "../types";

export const ProfileHeaderSubscribe = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  if (isOwnProfile) {
    return null;
  }

  // Check if user has subscription features enabled
  const hasSubscription = profile?.role === 'creator' || profile?.role === 'premium';

  if (!hasSubscription) {
    return null;
  }
  
  return (
    <Button 
      className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:bg-luxury-primary/90 text-white"
      size="sm"
    >
      Subscribe
    </Button>
  );
};
