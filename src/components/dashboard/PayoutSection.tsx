
import { Button } from "@/components/ui/button";
import { PayoutRequestDialog } from "@/components/dashboard/PayoutRequestDialog";
import { useToast } from "@/hooks/use-toast";

interface PayoutSectionProps {
  totalEarnings: number;
  latestPayout: {
    status: string;
    processed_at: string | null;
  } | null;
  onPayoutSuccess: () => void;
  payoutDialogOpen: boolean;
  setPayoutDialogOpen: (open: boolean) => void;
}

export function PayoutSection({
  totalEarnings,
  latestPayout,
  onPayoutSuccess,
  payoutDialogOpen,
  setPayoutDialogOpen
}: PayoutSectionProps) {
  return (
    <PayoutRequestDialog
      open={payoutDialogOpen}
      onOpenChange={setPayoutDialogOpen}
      totalEarnings={totalEarnings}
      onSuccess={onPayoutSuccess}
    />
  );
}
