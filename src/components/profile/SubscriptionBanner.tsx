
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SubscriptionBannerProps {
  username: string;
  price: number;
  creatorId: string;
}

export const SubscriptionBanner = ({ username, price, creatorId }: SubscriptionBannerProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating subscription checkout for creator:', creatorId);
      
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { 
          creator_id: creatorId
        }
      });

      if (error) {
        console.error('Subscription checkout error:', error);
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
      console.error('Error creating subscription checkout:', error);
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-luxury-dark/80 to-luxury-primary/20 backdrop-blur-lg border border-luxury-primary/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Subscribe to {username}</h3>
          <p className="text-luxury-neutral/70">Get exclusive access to premium content</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-luxury-primary mb-1">
            ${price}<span className="text-sm text-luxury-neutral/70">/month</span>
          </div>
          <Button 
            className="bg-luxury-primary hover:bg-luxury-secondary"
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Subscribe Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};
