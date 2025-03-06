
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BodyContactForm } from "./BodyContactForm";
import { useBodyContactSubmit } from "./hooks/useBodyContactSubmit";
import { useBodyContactAccess } from "./hooks/useBodyContactAccess";
import { PremiumAccessRequired } from "./components/PremiumAccessRequired";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface CreateBodyContactDialogProps {
  onSuccess?: () => void;
}

export const CreateBodyContactDialog = ({ onSuccess }: CreateBodyContactDialogProps) => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, isLoading } = useBodyContactSubmit({ onSuccess, onComplete: () => setOpen(false) });
  const accessResult = useBodyContactAccess();
  const session = useSession();
  const { toast } = useToast();
  
  // Debug output to console
  useEffect(() => {
    if (open && session?.user) {
      console.log("Current user email:", session.user.email);
      console.log("Access result:", accessResult);
    }
  }, [open, session, accessResult]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !session) {
      toast({
        title: "Authentication required",
        description: "Please log in to create an ad",
        variant: "destructive"
      });
      return;
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Button 
        onClick={() => handleOpenChange(true)}
        className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
      >
        Create Body Contact
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Create Body Contact Ad
            </h2>

            {accessResult.canAccess ? (
              <BodyContactForm 
                onSubmit={handleSubmit} 
                isLoading={isLoading} 
                onCancel={() => setOpen(false)} 
              />
            ) : (
              <PremiumAccessRequired accessResult={accessResult} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
