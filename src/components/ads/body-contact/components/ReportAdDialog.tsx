
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReportAdDialogProps {
  adId: string;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportAdDialog = ({ adId, userId, open, onOpenChange }: ReportAdDialogProps) => {
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const reportReasons = [
    { id: "inappropriate", label: "Inappropriate content" },
    { id: "fake", label: "Fake profile" },
    { id: "scam", label: "Scam or fraud" },
    { id: "underage", label: "Underage person" },
    { id: "other", label: "Other" }
  ];

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to report ads",
        variant: "destructive",
      });
      return;
    }

    if (!reason) {
      toast({
        title: "Error",
        description: "Please select a reason",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("reports")
        .insert({
          reporter_id: session.user.id,
          reported_id: userId,
          content_id: adId,
          content_type: "dating_ad",
          reason: reason,
          description: details,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our platform safe",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report Body Contact Ad
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">What's wrong with this ad?</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
              {reportReasons.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={item.id} id={item.id} />
                  <Label htmlFor={item.id}>{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea 
              id="details" 
              placeholder="Please explain the issue..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !reason}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isSubmitting ? "Submitting..." : "Report Ad"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
