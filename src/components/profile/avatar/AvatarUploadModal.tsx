
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Image, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarUploadModal = ({ 
  isOpen, 
  onOpenChange, 
  isUploading,
  onFileChange 
}: AvatarUploadModalProps) => {
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
      <DialogContent className="sm:max-w-md bg-luxury-dark border border-luxury-primary/20">
        <DialogHeader>
          <DialogTitle className="text-luxury-neutral text-center">Update Profile Picture</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 p-6"
        >
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
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
              accept="image/*"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />

            <div className="space-y-4">
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mx-auto w-12 h-12 text-luxury-primary"
                >
                  <Loader2 className="w-full h-full" />
                </motion.div>
              ) : (
                <div className="mx-auto w-12 h-12 text-luxury-primary/60">
                  <Image className="w-full h-full" />
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-luxury-neutral mb-2">
                  {isUploading ? 'Uploading...' : 'Choose your profile picture'}
                </h3>
                <p className="text-sm text-luxury-muted">
                  {isUploading 
                    ? 'Please wait while we upload your image'
                    : 'Drag and drop an image here, or click to select'
                  }
                </p>
              </div>

              {!isUploading && (
                <Button
                  variant="outline"
                  className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Image
                </Button>
              )}
            </div>
          </div>

          {/* Format Info */}
          <div className="text-xs text-luxury-muted text-center">
            Supported formats: JPG, PNG, GIF, WebP (Max 50MB)
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
