
import { Heart, MessageCircle, Share2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatingAd } from "../../../types/dating";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface AdActionsProps {
  ad: DatingAd;
}

export const AdActions = ({ ad }: AdActionsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.user) {
      navigate('/login');
      return;
    }
    navigate(`/messages?userId=${ad.user_id}`);
  };

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.user) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('connection_requests')
        .insert([{
          requester_id: session.user.id,
          target_user_id: ad.user_id,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Connection requested",
        description: `Connection request sent to ${ad.title}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="absolute top-2 right-2 flex flex-col gap-1.5 transition-opacity duration-200 z-20">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          size="icon" 
          variant="ghost" 
          className="dating-glass-panel action-button-glow text-white hover:bg-white/20 h-10 w-10 rounded-full border border-white/20 interactive-scale"
          onClick={handleLike}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          size="icon" 
          variant="ghost" 
          className="dating-glass-panel action-button-glow text-white hover:bg-white/20 h-10 w-10 rounded-full border border-white/20 interactive-scale"
          onClick={handleMessage}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          size="icon" 
          variant="ghost" 
          className="dating-glass-panel action-button-glow text-white hover:bg-white/20 h-10 w-10 rounded-full border border-white/20 interactive-scale"
          onClick={handleConnect}
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          size="icon" 
          variant="ghost" 
          className="dating-glass-panel action-button-glow text-white hover:bg-white/20 h-10 w-10 rounded-full border border-white/20 interactive-scale"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};
