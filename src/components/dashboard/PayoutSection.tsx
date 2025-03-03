
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PayoutRequestDialog } from "@/components/dashboard/PayoutRequestDialog";
import { useToast } from "@/hooks/use-toast";
import { EroboardStats } from "@/hooks/useEroboardData";

interface PayoutSectionProps {
  totalEarnings: number;
  latestPayout: {
    status: string;
    processed_at: string | null;
  } | null;
  onPayoutSuccess: () => void;
}

export function PayoutSection({
  totalEarnings,
  latestPayout,
  onPayoutSuccess
}: PayoutSectionProps) {
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  
  const isPayoutDisabled = () => {
    return latestPayout?.status === 'pending' || totalEarnings < 100;
  };

  const getPayoutButtonTooltip = () => {
    if (latestPayout?.status === 'pending') return 'You have a pending payout request';
    if (totalEarnings < 100) return 'Minimum payout amount is $100';
    return '';
  };

  const getPayoutStatusText = () => {
    if (!latestPayout) return null;

    switch (latestPayout.status) {
      case 'pending':
        return '(Under Review)';
      case 'approved':
        return '(Approved)';
      case 'processed':
        return `(Last Payment: ${new Date(latestPayout.processed_at!).toLocaleDateString()})`;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {getPayoutStatusText() && (
          <span className="text-sm text-luxury-muted">
            {getPayoutStatusText()}
          </span>
        )}
        <Button 
          onClick={() => setPayoutDialogOpen(true)}
          className="bg-luxury-primary hover:bg-luxury-primary/90"
          disabled={isPayoutDisabled()}
          title={getPayoutButtonTooltip()}
        >
          Request Payout
          {totalEarnings < 100 && (
            <span className="ml-2 text-xs opacity-70">
              (Min. $100)
            </span>
          )}
        </Button>
      </div>

      <PayoutRequestDialog
        open={payoutDialogOpen}
        onOpenChange={setPayoutDialogOpen}
        totalEarnings={totalEarnings}
        onSuccess={onPayoutSuccess}
      />
    </>
  );
}
