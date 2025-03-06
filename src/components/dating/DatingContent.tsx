
import { motion } from "framer-motion";
import { DatingAd } from "@/components/ads/types/dating";
import { VideoProfileCarousel } from "@/components/ads/VideoProfileCarousel";
import { EmptyProfilesState } from "./EmptyProfilesState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "@supabase/auth-helpers-react";
import { Clock, AlertCircle } from "lucide-react";

interface DatingContentProps {
  ads: DatingAd[] | undefined;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
}

export const DatingContent = ({ 
  ads, 
  canAccessBodyContact, 
  onAdCreationSuccess 
}: DatingContentProps) => {
  const session = useSession();
  const currentUserId = session?.user?.id;
  
  // Check if the user has any pending ads
  const hasPendingAds = ads?.some(ad => 
    ad.moderation_status === 'pending' && ad.user_id === currentUserId
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex-1 space-y-4"
    >
      {hasPendingAds && (
        <Alert className="bg-amber-50 border-amber-300">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Your ad is awaiting moderation</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your ad has been submitted successfully but must be approved before it's visible to others. 
            You can see your ad below, but other users won't see it until it's approved.
          </AlertDescription>
        </Alert>
      )}
      
      {ads && ads.length > 0 ? (
        <VideoProfileCarousel ads={ads} />
      ) : (
        <EmptyProfilesState 
          canAccessBodyContact={canAccessBodyContact}
          onAdCreationSuccess={onAdCreationSuccess}
        />
      )}
    </motion.div>
  );
};
