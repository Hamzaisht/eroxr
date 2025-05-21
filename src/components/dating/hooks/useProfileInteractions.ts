
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { DatingAd } from "@/components/ads/types/dating";

export function useProfileInteractions() {
  const session = useSession();
  const { toast } = useToast();

  const handleLike = (selectedAd: DatingAd | null) => {
    if (!selectedAd || !session) {
      toast({
        title: "Select a profile first",
        description: "You need to select a profile before you can like it",
        duration: 2000,
      });
      return;
    }
    toast({
      title: "Liked profile",
      description: `You've liked ${selectedAd.title}`,
      duration: 2000,
    });
  };

  const handleSkip = () => {
    toast({
      title: "Skipped profile",
      description: "Showing you different profiles",
      duration: 2000,
    });
    return null; // Return null to clear selected ad
  };

  const handleMessage = (selectedAd: DatingAd | null) => {
    if (!selectedAd || !session) {
      toast({
        title: "Select a profile first",
        description: "You need to select a profile before you can message them",
        duration: 2000,
      });
      return;
    }
    toast({
      title: "Message sent",
      description: `You've messaged ${selectedAd.title}`,
      duration: 2000,
    });
  };

  return {
    handleLike,
    handleSkip,
    handleMessage,
  };
}
