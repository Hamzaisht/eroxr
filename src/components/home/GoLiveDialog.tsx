import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface GoLiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoLiveDialog = ({ open, onOpenChange }: GoLiveDialogProps) => {
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Go Live</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Stream Title"
            className="bg-luxury-dark/30 border-luxury-neutral/10"
          />
          <Button 
            className="w-full bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary"
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "Live streaming feature will be available soon!",
              });
              onOpenChange(false);
            }}
          >
            Start Streaming
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};