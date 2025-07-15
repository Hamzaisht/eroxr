
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { usePlatformSubscription } from "@/hooks/usePlatformSubscription";
import { PremiumGate } from "@/components/subscription/PremiumGate";
import { EnhancedTipDialog } from "@/components/tips/EnhancedTipDialog";

interface TipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
}

export const TipDialog = ({ open, onOpenChange, recipientId }: TipDialogProps) => {
  const { hasPremium } = usePlatformSubscription();
  const session = useSession();
  const { toast } = useToast();

  if (!session?.user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-luxury-darker border-luxury-primary/20">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in to send tips to creators.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!hasPremium) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-luxury-darker border-luxury-primary/20 max-w-2xl">
          <PremiumGate feature="tipping creators">
            <div />
          </PremiumGate>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <EnhancedTipDialog
      open={open}
      onOpenChange={onOpenChange}
      recipientId={recipientId}
      onSuccess={() => {
        toast({
          title: "Tip sent!",
          description: "Your tip has been sent successfully.",
        });
      }}
    />
  );
};
