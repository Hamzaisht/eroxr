
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";

interface AttachmentButtonProps {
  onImageSelect: () => void;
  onDocumentSelect: () => void;
}

export const AttachmentButton = ({ onImageSelect, onDocumentSelect }: AttachmentButtonProps) => {
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        type="button"
        className="h-9 w-9 rounded-full"
        onClick={() => alert("File attachments coming soon")}
        aria-label="Attach file"
      >
        <Paperclip className="h-5 w-5 text-luxury-neutral" />
      </Button>
    </div>
  );
};
