
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
    <div className="relative w-full h-full min-h-[400px]">
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        {mediaUrl && (
          <img 
            src={mediaUrl} 
            alt="Blurred preview" 
            className="w-full h-full object-cover filter blur-3xl brightness-50 saturate-150"
          />
        )}
        
        {/* Depth layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/90" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        {/* Central content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="relative">
            {/* Glow background */}
            <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full scale-150" />
            
            {/* Main card */}
            <div className="relative bg-black/80 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl min-w-[300px]">
              <div className="mb-6">
                <Lock className="w-16 h-16 text-yellow-400 mx-auto drop-shadow-2xl animate-lock-pulse" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Exclusive Content</h3>
                <p className="text-gray-300">
                  Unlock this premium content for full access
                </p>
                
                <div className="bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      4K Quality
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      No watermarks
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Instant access
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Lifetime access
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xl font-bold px-6 py-3 rounded-full">
                  ${amount}
                </div>
                
                <Button
                  onClick={handlePurchase}
                  size="lg"
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg transform transition-all duration-200 text-lg"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Unlock Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer" />
        
        {/* Corner badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-bold px-4 py-2 rounded-full">
          PREMIUM
        </div>
      </div>
    </div>
  );
};
