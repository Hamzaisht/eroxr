
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import type { TipData } from "./types";

interface TipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
}

export const TipDialog = ({ open, onOpenChange, recipientId }: TipDialogProps) => {
  const [tipAmount, setTipAmount] = useState("5");
  const { toast } = useToast();
  const session = useSession();

  const handleSendTip = async () => {
    if (!session?.user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to send tips",
        variant: "destructive"
      });
      return;
    }

    try {
      const tipData: TipData = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        amount: parseFloat(tipAmount),
        call_id: 'profile-tip',
        sender_name: session.user.email
      };

      const { error } = await supabase
        .from('tips')
        .insert(tipData);

      if (error) throw error;

      toast({
        title: "Tip sent!",
        description: `Successfully sent $${tipAmount} tip`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending tip:", error);
      toast({
        title: "Error sending tip",
        description: "Please try again later",
        variant: "destructive"
      });
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
              >
                ${amount}
              </Button>
            ))}
          </div>
          <Button 
            onClick={handleSendTip}
            className="w-full bg-luxury-primary hover:bg-luxury-primary/90"
          >
            Send Tip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
