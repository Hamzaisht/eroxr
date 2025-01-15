import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
}

export const UploadDialog = ({ open, onOpenChange, onUpload }: UploadDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await onUpload(file);
    } finally {
      setIsUploading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-luxury-dark/95 backdrop-blur-xl border-luxury-primary/20">
        <motion.div 
          className="grid gap-4 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              id="eros-upload"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            />
            <div
              className={`w-full h-64 relative ${
                dragActive ? 'border-luxury-primary' : 'border-luxury-primary/20'
              } transition-colors duration-300`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Button
                onClick={() => document.getElementById('eros-upload')?.click()}
                className="absolute inset-0 w-full h-full rounded-lg border-2 border-dashed hover:border-luxury-primary/40 transition-colors bg-luxury-dark/20 group"
                disabled={isUploading}
              >
                <div className="flex flex-col items-center gap-4">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
                      <span className="text-luxury-primary">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Video className="h-8 w-8 text-luxury-primary group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <p className="text-luxury-primary font-medium">
                          Drop your video here or click to upload
                        </p>
                        <p className="text-sm text-luxury-neutral/60 mt-2">
                          Maximum size: 100MB
                        </p>
                        <p className="text-sm text-luxury-neutral/60">
                          Maximum length: 5 minutes
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};