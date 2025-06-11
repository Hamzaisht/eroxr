
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Image, Video, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface BannerUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BannerUploadDialog = ({ 
  isOpen, 
  onOpenChange, 
  isUploading,
  onFileChange 
}: BannerUploadDialogProps) => {
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const syntheticEvent = {
        target: { files: e.dataTransfer.files }
      } as React.ChangeEvent<HTMLInputElement>;
      onFileChange(syntheticEvent);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-luxury-dark border border-luxury-primary/20">
        <DialogHeader>
          <DialogTitle className="text-luxury-neutral text-center">Update Cover Banner</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 p-6"
        >
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-luxury-primary bg-luxury-primary/10'
                : 'border-luxury-primary/30 hover:border-luxury-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*,video/*"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />

            <div className="space-y-6">
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mx-auto w-16 h-16 text-luxury-primary"
                >
                  <Loader2 className="w-full h-full" />
                </motion.div>
              ) : (
                <div className="flex justify-center gap-4">
                  <div className="w-12 h-12 text-luxury-primary/60">
                    <Image className="w-full h-full" />
                  </div>
                  <div className="w-12 h-12 text-luxury-accent/60">
                    <Video className="w-full h-full" />
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold text-luxury-neutral mb-2">
                  {isUploading ? 'Uploading your banner...' : 'Upload your cover banner'}
                </h3>
                <p className="text-luxury-muted mb-4">
                  {isUploading 
                    ? 'Please wait while we process your media'
                    : 'Make a great first impression with an eye-catching banner'
                  }
                </p>
                <p className="text-sm text-luxury-muted/60">
                  Recommended size: 1500x500px • Images and videos supported
                </p>
              </div>

              {!isUploading && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Media
                </Button>
              )}
            </div>
          </div>

          {/* Format Info */}
          <div className="grid grid-cols-2 gap-4 text-xs text-luxury-muted">
            <div className="text-center p-3 rounded-lg bg-luxury-darker/30">
              <Image className="w-5 h-5 mx-auto mb-1 text-luxury-primary/60" />
              <div>Images: JPG, PNG, GIF, WebP</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-luxury-darker/30">
              <Video className="w-5 h-5 mx-auto mb-1 text-luxury-accent/60" />
              <div>Videos: MP4, WebM</div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
