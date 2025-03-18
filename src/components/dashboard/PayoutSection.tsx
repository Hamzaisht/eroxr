
import { Button } from "@/components/ui/button";
import { PayoutRequestDialog } from "@/components/dashboard/PayoutRequestDialog";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 mb-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Earnings & Payouts</h2>
        <Card className="p-6 glass-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-luxury-primary" />
                <h3 className="text-lg font-medium">Available Balance</h3>
              </div>
              <p className="text-3xl font-bold text-white mt-2">${totalEarnings.toFixed(2)}</p>
              {latestPayout?.status === 'pending' && (
                <span className="text-sm text-luxury-muted mt-1 block">
                  You have a pending payout request.
                </span>
              )}
            </div>
            <Button 
              onClick={() => setPayoutDialogOpen(true)}
              disabled={totalEarnings < 100 || latestPayout?.status === 'pending'}
              className="bg-luxury-primary hover:bg-luxury-primary/90 px-6 py-2"
              size="lg"
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Request Payout
              {totalEarnings < 100 && (
                <span className="ml-2 text-xs opacity-70">
                  (Min. $100)
                </span>
              )}
            </Button>
          </div>
          
          {latestPayout && (
            <div className="mt-6 pt-4 border-t border-luxury-primary/10">
              <h4 className="text-sm font-medium text-luxury-muted">Latest Payout Request</h4>
              <div className="flex items-center mt-2">
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  latestPayout.status === 'pending' ? 'bg-amber-500' :
                  latestPayout.status === 'approved' ? 'bg-green-500' :
                  latestPayout.status === 'processed' ? 'bg-blue-500' : 'bg-gray-500'
                }`} />
                <span className="text-sm">
                  Status: <span className="font-medium">{latestPayout.status.charAt(0).toUpperCase() + latestPayout.status.slice(1)}</span>
                  {latestPayout.processed_at && ` (Processed on ${new Date(latestPayout.processed_at).toLocaleDateString()})`}
                </span>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
      
      <PayoutRequestDialog
        open={payoutDialogOpen}
        onOpenChange={setPayoutDialogOpen}
        totalEarnings={totalEarnings}
        onSuccess={onPayoutSuccess}
      />
    </>
  );
}
