
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PayoutRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalEarnings: number;
  onSuccess: () => void;
}

export function PayoutRequestDialog({
  open,
  onOpenChange,
  totalEarnings,
  onSuccess,
}: PayoutRequestDialogProps) {
  const [amount, setAmount] = useState(totalEarnings.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const platformFeePercentage = 0.10; // 10% platform fee
  const minimumPayout = 100; // $100 minimum payout threshold

  const platformFee = Number(amount) * platformFeePercentage;
  const finalAmount = Number(amount) - platformFee;

  const handleSubmit = async () => {
    const requestAmount = Number(amount);

    if (requestAmount > totalEarnings) {
      toast({
        title: "Invalid amount",
        description: "Request amount cannot exceed your total earnings",
        variant: "destructive",
      });
      return;
    }

    if (requestAmount < minimumPayout) {
      toast({
        title: "Invalid amount",
        description: "Minimum payout amount is $100",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("payout_requests").insert({
        amount: requestAmount,
        platform_fee: platformFee,
        final_amount: finalAmount,
      });

      if (error) throw error;

      toast({
        title: "Payout requested",
        description: "Your payout request has been submitted successfully",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error requesting payout:", error);
      toast({
        title: "Error",
        description: "Failed to submit payout request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-luxury-darker text-white border-luxury-primary/20">
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription className="text-luxury-muted">
            {totalEarnings < minimumPayout 
              ? `You need at least $${minimumPayout} to request a payout. Current balance: $${totalEarnings.toFixed(2)}`
              : "Review your payout details before confirming"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Available Balance</span>
              <span className="font-semibold">${totalEarnings.toFixed(2)}</span>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="text-sm text-luxury-muted">
                  Request Amount (Minimum $100)
                </label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={totalEarnings}
                  min={minimumPayout}
                  className="bg-luxury-dark/50"
                />
              </div>
              <div className="space-y-2 p-4 bg-luxury-dark/30 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Amount Requested</span>
                  <span>${Number(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-luxury-muted">
                  <span>Platform Fee (10%)</span>
                  <span>-${platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-luxury-primary/10 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Final Amount</span>
                    <span className="text-luxury-primary">
                      ${finalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-luxury-primary/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-luxury-primary hover:bg-luxury-primary/90"
            disabled={isSubmitting || Number(amount) < minimumPayout || totalEarnings < minimumPayout}
          >
            {isSubmitting ? "Requesting..." : "Confirm Payout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
