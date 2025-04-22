
import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Heart, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";

interface ProfileCardOverlayProps {
  profileId: string;
  onLike?: () => void;
  onMessage?: () => void;
  onDismiss?: () => void;
}

export const ProfileCardOverlay = ({ 
  profileId, 
  onLike,
  onMessage,
  onDismiss
}: ProfileCardOverlayProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like profiles",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profile_favorites')
        .insert([
          { 
            user_id: session.user.id,
            favorite_profile_id: profileId,
            created_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      setIsLiked(true);
      if (onLike) onLike();
      
      toast({
        title: "Added to favorites",
        description: "Profile has been added to your favorites",
      });
    } catch (error) {
      console.error('Error liking profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like profile",
      });
    }
  };
  
  const handleMessage = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to message profiles",
        variant: "destructive",
      });
      return;
    }
    
    if (onMessage) onMessage();
    toast({
      title: "Opening chat",
      description: "Starting a conversation",
    });
  };
  
  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };
  
  return (
    <motion.div
      className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        "flex items-end justify-center pb-6 px-4",
        isMobile ? "opacity-100" : ""
      )}
    >
      <div className="flex gap-3 w-full justify-center">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            variant="outline"
            onClick={handleDismiss}
            className="w-12 h-12 rounded-full bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:text-white"
          >
            <X className="h-6 w-6" />
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            variant="outline"
            onClick={handleMessage}
            className="w-12 h-12 rounded-full bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30 hover:text-white"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            variant="outline"
            onClick={handleLike}
            disabled={isLiked}
            className={cn(
              "w-12 h-12 rounded-full",
              isLiked 
                ? "bg-green-500/20 border-green-500/50 text-green-400" 
                : "bg-luxury-primary/20 border-luxury-primary/50 text-luxury-primary hover:bg-luxury-primary/30 hover:text-white"
            )}
          >
            {isLiked ? <Check className="h-6 w-6" /> : <Heart className="h-6 w-6" />}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
