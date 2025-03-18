
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, CreditCard, Loader2 } from "lucide-react";

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
  onSuccess
}: PayoutRequestDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(totalEarnings);
  const [confirmTerms, setConfirmTerms] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  // Set payout amount to total earnings when dialog opens
  useState(() => {
    if (open) {
      setPayoutAmount(totalEarnings);
    }
  });

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    
    if (payoutAmount < 100) {
      toast({
        title: "Minimum amount required",
        description: "Minimum payout amount is $100",
        variant: "destructive",
      });
      return;
    }
    
    if (payoutAmount > totalEarnings) {
      toast({
        title: "Invalid amount",
        description: "Payout amount cannot exceed your total earnings",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirmTerms) {
      toast({
        title: "Terms required",
        description: "Please confirm the payout terms",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('payout_requests')
        .insert([
          {
            creator_id: session.user.id,
            amount: payoutAmount,
            status: 'pending',
            requested_at: new Date().toISOString(),
          }
        ])
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Payout request submitted",
        description: "Your payout request has been submitted and is pending review",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Payout request error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit payout request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxAmount = () => {
    setPayoutAmount(totalEarnings);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-luxury-darker text-white border-luxury-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-luxury-primary" />
            Request Payout
          </DialogTitle>
          <DialogDescription className="text-luxury-muted">
            Request a payout of your earnings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount">Payout Amount</Label>
              <button 
                onClick={handleMaxAmount}
                className="text-xs text-luxury-primary hover:underline"
              >
                Max: ${totalEarnings.toFixed(2)}
              </button>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-muted h-4 w-4" />
              <Input
                id="amount"
                type="number"
                min={100}
                max={totalEarnings}
                className="pl-9 bg-luxury-darker border-luxury-primary/30 focus:border-luxury-primary"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(Number(e.target.value))}
              />
            </div>
            <p className="text-xs text-luxury-muted">
              Minimum payout amount is $100. Payouts typically process within 3-5 business days.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <div className="p-3 border border-luxury-primary/30 rounded-md flex items-center space-x-3 bg-luxury-dark/50">
              <CreditCard className="h-5 w-5 text-luxury-primary" />
              <div>
                <p className="font-medium">Bank Account (ACH)</p>
                <p className="text-xs text-luxury-muted">
                  Ending in •••• 4321
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-top space-x-2">
              <Checkbox 
                id="terms" 
                checked={confirmTerms}
                onCheckedChange={(checked) => setConfirmTerms(checked as boolean)}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal text-luxury-muted cursor-pointer"
                >
                  I confirm that I am requesting a payout of ${payoutAmount.toFixed(2)} to my bank account, which may be subject to transaction fees.
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !confirmTerms || payoutAmount < 100 || payoutAmount > totalEarnings}
            className="bg-luxury-primary hover:bg-luxury-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Request Payout'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
