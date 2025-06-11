
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload, Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface MediaUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'avatar' | 'banner';
  currentUrl?: string;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export const MediaUploadDialog = ({
  isOpen,
  onClose,
  type,
  currentUrl,
  onUpload,
  isUploading
}: MediaUploadDialogProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedFile(null);
    onClose();
  };

  const isAvatar = type === 'avatar';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-luxury-dark/95 backdrop-blur-xl border border-luxury-primary/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-luxury-neutral">
            Update {isAvatar ? 'Avatar' : 'Banner'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-luxury-muted hover:text-luxury-neutral"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 pt-4 space-y-6">
          {/* Current Media Preview */}
          {(currentUrl || preview) && (
            <div className="text-center">
              <div className={cn(
                "mx-auto overflow-hidden border-2 border-luxury-primary/20",
                isAvatar ? "w-24 h-24 rounded-full" : "w-full h-32 rounded-lg"
              )}>
                <img
                  src={preview || currentUrl}
                  alt={isAvatar ? "Avatar preview" : "Banner preview"}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-luxury-muted mt-2">
                {preview ? 'New' : 'Current'} {isAvatar ? 'avatar' : 'banner'}
              </p>
            </div>
          )}

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
              isDragActive
                ? "border-luxury-primary bg-luxury-primary/10"
                : "border-luxury-primary/30 hover:border-luxury-primary/50",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />
            
            <motion.div
              animate={{ scale: isDragActive ? 1.05 : 1 }}
              className="space-y-4"
            >
              {isUploading ? (
                <Loader2 className="w-12 h-12 mx-auto text-luxury-primary animate-spin" />
              ) : (
                <div className="w-12 h-12 mx-auto text-luxury-primary">
                  {isAvatar ? <Camera className="w-full h-full" /> : <ImageIcon className="w-full h-full" />}
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-luxury-neutral mb-1">
                  {isUploading ? 'Uploading...' : isDragActive ? 'Drop it here!' : 'Upload your media'}
                </h3>
                <p className="text-sm text-luxury-muted">
                  {isUploading 
                    ? 'Please wait while we process your file'
                    : 'Drag and drop or click to select'
                  }
                </p>
              </div>

              {!isUploading && (
                <Button
                  variant="outline"
                  className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              )}
            </motion.div>
          </div>

          {/* Recommendations */}
          <div className="text-xs text-luxury-muted space-y-1">
            <p>• {isAvatar ? 'Square images work best' : 'Recommended: 1500x500px'}</p>
            <p>• Supported: JPG, PNG, GIF, WebP</p>
            <p>• Max size: {isAvatar ? '5MB' : '10MB'}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 border-luxury-neutral/30 text-luxury-neutral"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 bg-luxury-primary hover:bg-luxury-primary/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
