import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface CreatorActionsProps {
  creatorId: string;
  name: string;
  subscribers: number;
  onSubscriberChange: (change: number) => void;
  isFollowing: boolean;
  isSubscribed: boolean;
}

export const CreatorActions = ({ 
  creatorId, 
  name,
  subscribers,
  onSubscriberChange,
  isFollowing,
  isSubscribed
}: CreatorActionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like creators",
        duration: 3000,
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('creator_likes')
          .delete()
          .eq('user_id', session.user.id)
          .eq('creator_id', creatorId);
      } else {
        await supabase
          .from('creator_likes')
          .insert([
            { user_id: session.user.id, creator_id: creatorId }
          ]);
      }

      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Removed from favorites" : "Added to favorites",
        description: isLiked ? `${name} removed from your favorites` : `${name} added to your favorites`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 3000,
      });
    }
  };

  const handleSubscribe = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to creators",
        duration: 3000,
      });
      return;
    }

    try {
      if (isSubscribed) {
        await supabase
          .from('creator_subscriptions')
          .delete()
          .eq('user_id', session.user.id)
          .eq('creator_id', creatorId);
        onSubscriberChange(-1);
      } else {
        await supabase
          .from('creator_subscriptions')
          .insert([
            { user_id: session.user.id, creator_id: creatorId }
          ]);
        onSubscriberChange(1);
      }

      toast({
        title: isSubscribed ? "Unsubscribed" : "Subscribed!",
        description: isSubscribed 
          ? `You have unsubscribed from ${name}` 
          : `You are now subscribed to ${name}! You'll receive updates about new content.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Button 
        size="icon" 
        variant="ghost" 
        className={`rounded-full backdrop-blur-md transition-all duration-300 ${
          isLiked 
            ? "bg-primary/20 text-primary hover:bg-primary/30" 
            : "bg-white/20 text-white hover:bg-white/40"
        }`}
        onClick={handleLike}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-primary" : ""}`} />
      </Button>

      <Button 
        className={`relative overflow-hidden transition-all hover:scale-105 ${
          isSubscribed 
            ? "bg-gradient-to-r from-green-500 to-green-600"
            : "bg-gradient-to-r from-primary to-secondary"
        }`}
        onClick={handleSubscribe}
      >
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </>
  );
};