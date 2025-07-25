
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatingAd } from "@/types/dating";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdActionsProps {
  ad: DatingAd;
}

export const AdActions = ({ ad }: AdActionsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!session?.user) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{
          user_id: session.user.id,
          target_user_id: ad.user_id,
          target_ad_id: ad.id
        }]);

      if (error) throw error;

      toast({
        title: "Liked",
        description: `Added ${ad.title} to favorites`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like profile",
        variant: "destructive",
      });
    }
  };

  const handleMessage = () => {
    if (!session?.user) {
      navigate('/login');
      return;
    }
    navigate(`/messages?userId=${ad.user_id}`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: ad.title,
        text: `Check out this profile: ${ad.title}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Profile link copied to clipboard",
      });
    }
  };

  return (
    <div className="absolute bottom-20 right-4 flex flex-col gap-3">
      <Button size="icon" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 h-10 w-10 rounded-full" onClick={handleLike}>
        <Heart className="h-5 w-5" />
      </Button>
      
      <Button size="icon" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 h-10 w-10 rounded-full" onClick={handleMessage}>
        <MessageCircle className="h-5 w-5" />
      </Button>
      
      <Button size="icon" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 h-10 w-10 rounded-full" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
      </Button>
      
      {ad.views || ad.view_count ? (
        <div className="text-xs text-white/70 text-center mt-1">
          {(ad.views || ad.view_count || 0).toLocaleString()} views
        </div>
      ) : null}
    </div>
  );
};
