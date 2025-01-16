import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => Promise<string>;
  isUploading: boolean;
  uploadProgress: number;
}

export const UploadDialog = ({
  open,
  onOpenChange,
  onUpload,
  isUploading,
  uploadProgress,
}: UploadDialogProps) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onUpload(file);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*"
              disabled={isUploading}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="w-full h-32 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors"
                disabled={isUploading}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8" />
                  <span>{isUploading ? 'Uploading...' : 'Upload file'}</span>
                  <span className="text-sm text-muted-foreground">
                    Maximum size: 100MB
                  </span>
                </div>
              </Button>
              {isUploading && (
                <Progress 
                  value={uploadProgress} 
                  className="mt-4"
                />
              )}
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};