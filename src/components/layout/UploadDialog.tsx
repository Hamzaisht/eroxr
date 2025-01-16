import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

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
  uploadProgress
}: UploadDialogProps) => {
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onUpload(file);
      } catch (error) {
        console.error('File upload error:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              id="file-upload"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            
            <motion.div 
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="w-full h-32 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span>Uploading...</span>
                    <span className="text-sm text-muted-foreground">
                      {uploadProgress.toFixed(0)}%
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8" />
                    <span>Click to select file</span>
                    <span className="text-sm text-muted-foreground">
                      Images and videos up to 100MB
                    </span>
                  </div>
                )}
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