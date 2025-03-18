
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormSubmitButtonsProps {
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const FormSubmitButtons = ({ onSubmit, onCancel, isLoading }: FormSubmitButtonsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2">
      <Button variant="outline" onClick={onCancel} size="sm">
        Cancel
      </Button>
      <Button 
        onClick={onSubmit}
        disabled={isLoading}
        size="sm"
        className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Ad"
        )}
      </Button>
    </div>
  );
};
