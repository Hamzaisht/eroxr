import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostSubmitButtonsProps {
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const PostSubmitButtons = ({
  isLoading,
  onCancel,
  onSubmit,
}: PostSubmitButtonsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Post
      </Button>
    </div>
  );
};