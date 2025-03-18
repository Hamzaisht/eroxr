
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
    <motion.div 
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
          Creator Dashboard
        </h1>
        <p className="text-luxury-muted mt-1 text-lg">
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
          className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:opacity-90 transition-opacity"
          disabled={isPayoutDisabled}
          title={payoutTooltip}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Request Payout
          {totalEarnings < 100 && (
            <span className="ml-2 text-xs opacity-70">
              (Min. $100)
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
