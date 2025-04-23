
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { MediaOptions } from "./MediaOptions";

interface AttachmentButtonProps {
  onImageSelect: () => void;
  onDocumentSelect: () => void;
}

export const AttachmentButton = ({ onImageSelect, onDocumentSelect }: AttachmentButtonProps) => {
  const [showMediaOptions, setShowMediaOptions] = useState(false);

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        type="button"
        className="h-9 w-9 rounded-full"
        onClick={() => setShowMediaOptions(!showMediaOptions)}
        aria-label="Attach file"
      >
        <Paperclip className="h-5 w-5 text-luxury-neutral" />
      </Button>
      
      {showMediaOptions && (
        <MediaOptions 
          onImageSelect={onImageSelect}
          onDocumentSelect={onDocumentSelect}
          onClose={() => setShowMediaOptions(false)}
        />
      )}
    </div>
  );
};
