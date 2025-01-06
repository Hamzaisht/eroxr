import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface PPVContentProps {
  postId: string;
  amount: number;
}

export const PPVContent = ({ postId, amount }: PPVContentProps) => {
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const handlePurchase = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase content",
        duration: 3000,
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('post_purchases')
        .insert([
          {
            post_id: postId,
            user_id: session.user.id,
            amount: amount
          }
        ]);

      if (error) throw error;

      toast({
        title: "Purchase successful",
        description: "You now have access to this content",
      });

      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-6 text-center">
      <Lock className="w-12 h-12 mx-auto text-luxury-primary" />
      <div>
        <h3 className="text-lg font-semibold">Premium Content</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Unlock this content for ${amount}
        </p>
        <Button
          onClick={handlePurchase}
          className="bg-luxury-primary hover:bg-luxury-primary/90"
        >
          Purchase Access
        </Button>
      </div>
    </div>
  );
};