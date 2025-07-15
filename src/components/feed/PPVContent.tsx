
import { Button } from "@/components/ui/button";
import { Lock, Ghost } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useGhostMode } from "@/hooks/useGhostMode";

interface PPVContentProps {
  postId: string;
  amount: number;
  mediaUrl?: string;
}

export const PPVContent = ({ postId, amount, mediaUrl }: PPVContentProps) => {
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();
  const { isGhostMode } = useGhostMode();

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
      console.log('Creating PPV payment for post:', postId, 'amount:', amount);
      
      const { data, error } = await supabase.functions.invoke('create-ppv-payment', {
        body: { 
          post_id: postId,
          amount: amount 
        }
      });

      if (error) {
        console.error('PPV payment error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error creating PPV payment:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  // In ghost mode, we don't block the content, but show a ghost indicator
  if (isGhostMode) {
    return (
      <div className="absolute top-2 right-2 z-50 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1">
        <Ghost className="h-3.5 w-3.5 text-purple-400" />
        <span>Viewing paid content (${amount}) in Ghost Mode</span>
      </div>
    );
  }

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
