
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  totalEarnings: number;
  onRequestPayout: () => void;
  isPayoutDisabled: boolean;
  payoutStatus: string | null;
  payoutTooltip: string;
}

export function DashboardHeader({
  totalEarnings,
  onRequestPayout,
  isPayoutDisabled,
  payoutStatus,
  payoutTooltip
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
          Creator Dashboard
        </h1>
        <p className="text-luxury-muted mt-1">
          Track your performance and earnings
        </p>
      </div>
      <div className="flex items-center gap-4">
        {payoutStatus && (
          <span className="text-sm text-luxury-muted">
            {payoutStatus}
          </span>
        )}
        <Button 
          onClick={onRequestPayout}
          className="bg-luxury-primary hover:bg-luxury-primary/90"
          disabled={isPayoutDisabled}
          title={payoutTooltip}
        >
          Request Payout
          {totalEarnings < 100 && (
            <span className="ml-2 text-xs opacity-70">
              (Min. $100)
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
