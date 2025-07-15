
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Settings, ExternalLink } from "lucide-react";

export const SubscriptionManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleManageSubscriptions = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage subscriptions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Opening customer portal...');
      
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) {
        console.error('Customer portal error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to customer portal:', data.url);
        // Open customer portal in same tab
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Portal failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-luxury-darker/30 border-luxury-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-6 h-6 text-luxury-primary" />
        <div>
          <h3 className="text-lg font-semibold text-luxury-neutral">Manage Subscriptions</h3>
          <p className="text-sm text-luxury-muted">Update your payment methods and subscriptions</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-luxury-muted text-sm">
          Access your billing portal to:
        </p>
        <ul className="text-xs text-luxury-muted space-y-1 ml-4">
          <li>• Update payment methods</li>
          <li>• View billing history</li>
          <li>• Cancel subscriptions</li>
          <li>• Download invoices</li>
        </ul>

        <Button
          onClick={handleManageSubscriptions}
          disabled={isLoading}
          className="w-full bg-luxury-primary hover:bg-luxury-primary/90"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {isLoading ? "Opening..." : "Manage Billing"}
        </Button>
      </div>
    </Card>
  );
};
