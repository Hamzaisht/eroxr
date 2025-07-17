
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Plus } from "lucide-react";
import { MediaAttachmentHub } from "../chat/MediaAttachmentHub";
import { AnimatePresence } from "framer-motion";

interface AttachmentButtonProps {
  onImageSelect: () => void;
  onDocumentSelect: () => void;
  onMediaSelect?: (blob: Blob, type: 'snax' | 'media', duration?: number) => void;
}

export const AttachmentButton = ({ onImageSelect, onDocumentSelect, onMediaSelect }: AttachmentButtonProps) => {
  const [showHub, setShowHub] = useState(false);

  const handleMediaSelect = (blob: Blob, type: 'snax' | 'media', duration?: number) => {
    if (onMediaSelect) {
      onMediaSelect(blob, type, duration);
    }
    setShowHub(false);
  };

  const handleToggleHub = () => {
    console.log('Plus button clicked, current showHub:', showHub);
    setShowHub(!showHub);
  };

  const handleCloseHub = () => {
    console.log('Closing hub');
    setShowHub(false);
  };

  return (
    <>
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          type="button"
          className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20 transition-all duration-300 hover:scale-110"
          onClick={handleToggleHub}
          aria-label="Attach media"
        >
          <Plus className="h-5 w-5 text-primary" />
        </Button>

        <AnimatePresence>
          {showHub && (
            <MediaAttachmentHub
              onClose={handleCloseHub}
              onMediaSelect={handleMediaSelect}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
