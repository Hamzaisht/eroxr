
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { CreditCard, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

interface StripeAccount {
  stripe_account_id: string;
  account_enabled: boolean;
  onboarding_completed: boolean;
  capabilities_card_payments: string;
  capabilities_transfers: string;
}

interface CreatorStripeOnboardingProps {
  stripeAccount?: StripeAccount | null;
  onAccountUpdate: () => void;
}

export const CreatorStripeOnboarding = ({ stripeAccount, onAccountUpdate }: CreatorStripeOnboardingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleStripeOnboarding = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to set up payments",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting Stripe Connect onboarding...');
      
      const { data, error } = await supabase.functions.invoke('create-stripe-connect');

      if (error) {
        console.error('Stripe Connect error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe onboarding:', data.url);
        // Open Stripe onboarding in same tab
        window.location.href = data.url;
      } else {
        throw new Error('No onboarding URL received');
      }
    } catch (error: any) {
      console.error('Error setting up Stripe Connect:', error);
      toast({
        title: "Setup failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountStatus = () => {
    if (!stripeAccount) {
      return { status: "not_started", label: "Not Started", color: "destructive" as const };
    }
    
    if (stripeAccount.onboarding_completed && stripeAccount.account_enabled) {
      return { status: "active", label: "Active", color: "default" as const };
    }
    
    if (stripeAccount.onboarding_completed && !stripeAccount.account_enabled) {
      return { status: "pending", label: "Pending Review", color: "secondary" as const };
    }
    
    return { status: "incomplete", label: "Incomplete", color: "destructive" as const };
  };

  const accountStatus = getAccountStatus();

  return (
    <Card className="p-6 bg-luxury-darker/30 border-luxury-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-luxury-primary" />
          <div>
            <h3 className="text-lg font-semibold text-luxury-neutral">Payment Setup</h3>
            <p className="text-sm text-luxury-muted">Configure Stripe to receive payments</p>
          </div>
        </div>
        <Badge variant={accountStatus.color} className="flex items-center gap-1">
          {accountStatus.status === "active" ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
          {accountStatus.label}
        </Badge>
      </div>

      {stripeAccount && (
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-luxury-muted">Card Payments:</span>
            <Badge variant={stripeAccount.capabilities_card_payments === 'active' ? 'default' : 'secondary'}>
              {stripeAccount.capabilities_card_payments}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury-muted">Transfers:</span>
            <Badge variant={stripeAccount.capabilities_transfers === 'active' ? 'default' : 'secondary'}>
              {stripeAccount.capabilities_transfers}
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {accountStatus.status === "active" && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>You're all set to receive payments!</span>
          </div>
        )}

        {accountStatus.status !== "active" && (
          <div className="space-y-2">
            <p className="text-luxury-muted text-sm">
              {accountStatus.status === "not_started" 
                ? "Set up your Stripe account to start earning money from subscriptions and content sales."
                : "Complete your Stripe account setup to start receiving payments."
              }
            </p>
            <ul className="text-xs text-luxury-muted space-y-1 ml-4">
              <li>• Verify your identity</li>
              <li>• Add bank account details</li>
              <li>• Configure payout schedule</li>
            </ul>
          </div>
        )}

        <Button
          onClick={handleStripeOnboarding}
          disabled={isLoading}
          className="w-full bg-luxury-primary hover:bg-luxury-primary/90"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {isLoading ? "Setting up..." : accountStatus.status === "not_started" ? "Set Up Payments" : "Continue Setup"}
        </Button>
      </div>
    </Card>
  );
};
