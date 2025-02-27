
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { TipData } from "./types";

interface TipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
}

export const TipDialog = ({ open, onOpenChange, recipientId }: TipDialogProps) => {
  const [tipAmount, setTipAmount] = useState("5");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const handleSendTip = async () => {
    if (!session?.user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to send tips",
        variant: "destructive"
      });
      return;
    }

    if (session.user.id === recipientId) {
      toast({
        title: "Invalid action",
        description: "You cannot send tips to yourself",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const amount = parseFloat(tipAmount);
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid tip amount");
      }

      const tipData: TipData = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        amount: amount,
        call_id: 'profile-tip',
        sender_name: session.user.email
      };

      const { error } = await supabase
        .from('tips')
        .insert(tipData);

      if (error) throw error;

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ["profileStats", recipientId] });

      toast({
        title: "Tip sent!",
        description: `Successfully sent $${amount} tip`,
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error sending tip:", error);
      toast({
        title: "Error sending tip",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-luxury-darker border-luxury-primary/20">
        <DialogHeader>
          <DialogTitle>Send a Tip</DialogTitle>
          <DialogDescription>Support this creator with a tip</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-4">
            {["5", "10", "20", "50", "100"].map((amount) => (
              <Button
                key={amount}
                variant={tipAmount === amount ? "default" : "outline"}
                onClick={() => setTipAmount(amount)}
                className="flex-1"
                disabled={isProcessing}
              >
                ${amount}
              </Button>
            ))}
          </div>
          <Button 
            onClick={handleSendTip}
            className="w-full bg-luxury-primary hover:bg-luxury-primary/90"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : "Send Tip"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
