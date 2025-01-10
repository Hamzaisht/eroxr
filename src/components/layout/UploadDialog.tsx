import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
}

export const UploadDialog = ({ open, onOpenChange, onUpload }: UploadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-luxury-dark/95 backdrop-blur-xl border-luxury-primary/20">
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              id="eros-upload"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onUpload(file);
                  onOpenChange(false);
                }
              }}
            />
            <Button
              onClick={() => document.getElementById('eros-upload')?.click()}
              className="w-full h-32 rounded-lg border-2 border-dashed border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors bg-luxury-dark/20"
            >
              <div className="flex flex-col items-center gap-2">
                <Video className="h-8 w-8" />
                <span>Upload video</span>
                <span className="text-sm text-luxury-neutral/60">
                  Maximum length: 60 seconds
                </span>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};