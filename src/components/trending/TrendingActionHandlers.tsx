import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useTrendingActionHandlers = () => {
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  const handleMessage = async (creatorId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to message creators",
        variant: "destructive",
      });
      return;
    }
    navigate(`/messages/${creatorId}`);
  };

  const handleFollow = async (creatorId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow creators",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('followers')
        .insert([
          {
            follower_id: session.user.id,
            following_id: creatorId,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "You are now following this creator",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow creator. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleMessage,
    handleFollow,
  };
};