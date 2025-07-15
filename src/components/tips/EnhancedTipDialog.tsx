
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Heart, Loader2 } from "lucide-react";

const stripePromise = loadStripe("pk_test_YOUR_PUBLISHABLE_KEY"); // Replace with your publishable key

interface TipFormProps {
  recipientId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const TipForm = ({ recipientId, onSuccess, onClose }: TipFormProps) => {
  const [amount, setAmount] = useState("10");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !session?.user) {
      return;
    }

    setIsProcessing(true);

    try {
      const tipAmount = parseFloat(amount);
      if (isNaN(tipAmount) || tipAmount <= 0) {
        throw new Error("Please enter a valid tip amount");
      }

      // Create payment intent
      const { data, error } = await supabase.functions.invoke('process-tip-payment', {
        body: {
          recipientId,
          amount: tipAmount,
          message: message.trim() || null,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: session.user.email,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      toast({
        title: "Tip sent successfully!",
        description: `Your ${tipAmount} SEK tip has been sent. The creator will receive ${(tipAmount * 0.93).toFixed(2)} SEK after platform fees.`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error sending tip:", error);
      toast({
        title: "Error sending tip",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const presetAmounts = ["5", "10", "25", "50", "100"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-3">
            Select or enter tip amount (SEK)
          </label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant={amount === preset ? "default" : "outline"}
                onClick={() => setAmount(preset)}
                className="text-sm"
                disabled={isProcessing}
              >
                {preset}
              </Button>
            ))}
          </div>
          <Input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Custom amount"
            className="bg-luxury-darker border-luxury-primary/20"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Message (optional)
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message..."
            className="bg-luxury-darker border-luxury-primary/20 resize-none"
            rows={3}
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Payment Method
          </label>
          <div className="p-3 rounded-lg bg-luxury-darker border border-luxury-primary/20">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#e2e8f0',
                    '::placeholder': {
                      color: '#64748b',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {amount && parseFloat(amount) > 0 && (
          <div className="p-4 rounded-lg bg-luxury-primary/10 border border-luxury-primary/20">
            <div className="text-sm text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Tip amount:</span>
                <span>{parseFloat(amount).toFixed(2)} SEK</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee (7%):</span>
                <span>{(parseFloat(amount) * 0.07).toFixed(2)} SEK</span>
              </div>
              <div className="flex justify-between font-semibold text-white border-t border-luxury-primary/20 pt-1">
                <span>Creator receives:</span>
                <span>{(parseFloat(amount) * 0.93).toFixed(2)} SEK</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-luxury-primary hover:bg-luxury-primary/90"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing Payment...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Send Tip
          </span>
        )}
      </Button>
    </form>
  );
};

interface EnhancedTipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  onSuccess?: () => void;
}

export const EnhancedTipDialog = ({ open, onOpenChange, recipientId, onSuccess }: EnhancedTipDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-luxury-darker border-luxury-primary/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-5 w-5 text-luxury-primary" />
            Send a Tip
          </DialogTitle>
        </DialogHeader>
        
        <Elements stripe={stripePromise}>
          <TipForm
            recipientId={recipientId}
            onSuccess={() => onSuccess?.()}
            onClose={() => onOpenChange(false)}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};
