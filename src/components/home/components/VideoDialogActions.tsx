
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
        onClick={onUpload}
        disabled={!isValid || isSubmitting || isComplete}
        className="bg-luxury-primary hover:bg-luxury-primary/80"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : isComplete ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete
          </>
        ) : (
          'Post Eros'
        )}
      </Button>
    </div>
  );
};
