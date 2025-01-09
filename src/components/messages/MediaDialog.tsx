import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface MediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMediaSelect: (files: FileList) => void;
}

export const MediaDialog = ({ isOpen, onClose, onMediaSelect }: MediaDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onMediaSelect(e.target.files);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="grid gap-4">
          <div className="flex flex-col items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleMediaSelect}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Choose Files
            </Button>
            <p className="text-sm text-muted-foreground">
              Select photos or videos to share
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};