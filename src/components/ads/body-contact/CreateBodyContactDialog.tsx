
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BodyContactForm } from "./BodyContactForm";
import { useBodyContactSubmit } from "./hooks/useBodyContactSubmit";

interface CreateBodyContactDialogProps {
  onSuccess?: () => void;
}

export const CreateBodyContactDialog = ({ onSuccess }: CreateBodyContactDialogProps) => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, isLoading } = useBodyContactSubmit({ onSuccess, onComplete: () => setOpen(false) });

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
      >
        Create Body Contact
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Create Body Contact Ad
            </h2>

            <BodyContactForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
              onCancel={() => setOpen(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
