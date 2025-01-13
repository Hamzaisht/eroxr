import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface PPVContentProps {
  postId: string;
  amount: number;
  mediaUrl?: string;
}

export const PPVContent = ({ postId, amount, mediaUrl }: PPVContentProps) => {
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
    <div className="relative w-full h-full min-h-[300px] group">
      {mediaUrl && (
        <div className="absolute inset-0">
          <img 
            src={mediaUrl} 
            alt="Blurred preview" 
            className="w-full h-full object-cover filter blur-xl brightness-50"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Lock className="w-12 h-12 text-luxury-primary animate-pulse" />
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Premium Content</h3>
          <p className="text-sm text-gray-300 mb-4">
            Unlock this exclusive content for ${amount}
          </p>
          <Button
            onClick={handlePurchase}
            className="bg-luxury-primary hover:bg-luxury-primary/90 text-white px-8 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Purchase Access
          </Button>
        </div>
      </div>
    </div>
  );
};