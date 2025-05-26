
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

interface VideoDialogActionsProps {
  onCancel: () => void;
  onUpload: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  isComplete: boolean;
}

export const VideoDialogActions = ({
  onCancel,
  onUpload,
  isSubmitting,
  isValid,
  isComplete
}: VideoDialogActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        onClick={() => alert("Upload feature coming soon")}
        disabled={!isValid || isSubmitting || isComplete}
        className="bg-luxury-primary hover:bg-luxury-primary/80"
      >
        Post Eros
      </Button>
    </div>
  );
};
