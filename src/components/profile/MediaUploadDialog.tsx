
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload, Camera, Image as ImageIcon, Loader2, Play, Video, CheckCircle } from "lucide-react";
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
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type === 'banner' 
      ? {
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
          'video/*': ['.mp4', '.webm', '.mov']
        }
      : {
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
    setFileType(null);
    onClose();
  };

  const isAvatar = type === 'avatar';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-luxury-dark/98 backdrop-blur-2xl border border-luxury-primary/10 shadow-2xl rounded-3xl overflow-hidden">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 pb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/5 to-luxury-accent/5" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-luxury-primary/20 flex items-center justify-center">
                {isAvatar ? <Camera className="w-5 h-5 text-luxury-primary" /> : <ImageIcon className="w-5 h-5 text-luxury-primary" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-luxury-neutral">
                  Update {isAvatar ? 'Avatar' : 'Banner'}
                </h2>
                <p className="text-sm text-luxury-muted">
                  {isAvatar ? 'Your profile picture' : 'Your cover media'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-luxury-muted hover:text-luxury-neutral rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        <div className="px-8 pb-8 space-y-8">
          {/* Current/Preview Media */}
          <AnimatePresence mode="wait">
            {(currentUrl || preview) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <div className={cn(
                  "mx-auto overflow-hidden border-2 border-luxury-primary/20 bg-luxury-darker/50 relative group",
                  isAvatar ? "w-32 h-32 rounded-full" : "w-full h-48 rounded-2xl"
                )}>
                  {preview && fileType === 'video' ? (
                    <video
                      src={preview}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={preview || currentUrl}
                      alt={isAvatar ? "Avatar preview" : "Banner preview"}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {fileType === 'video' && (
                    <div className="absolute top-2 right-2 bg-black/60 rounded-lg px-2 py-1 flex items-center gap-1">
                      <Play className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">AUTO</span>
                    </div>
                  )}
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-luxury-muted mt-3"
                >
                  {preview ? 'New' : 'Current'} {isAvatar ? 'avatar' : 'banner'}
                  {fileType === 'video' && ' • Auto-looping video'}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            {...getRootProps()}
            className={cn(
              "relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 group overflow-hidden",
              isDragActive
                ? "border-luxury-primary bg-luxury-primary/10 scale-[1.02]"
                : "border-luxury-primary/20 hover:border-luxury-primary/40 hover:bg-luxury-primary/5",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />
            
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/5 via-transparent to-luxury-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <motion.div
              animate={{ 
                scale: isDragActive ? 1.05 : 1,
                rotate: isUploading ? 360 : 0
              }}
              transition={{ 
                rotate: { duration: 2, repeat: isUploading ? Infinity : 0, ease: "linear" }
              }}
              className="relative space-y-6"
            >
              {isUploading ? (
                <div className="w-16 h-16 mx-auto">
                  <Loader2 className="w-full h-full text-luxury-primary animate-spin" />
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 text-luxury-primary/80"
                  >
                    {isAvatar ? <Camera className="w-full h-full" /> : <ImageIcon className="w-full h-full" />}
                  </motion.div>
                  {!isAvatar && (
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="w-12 h-12 text-luxury-accent/80"
                    >
                      <Video className="w-full h-full" />
                    </motion.div>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-luxury-neutral">
                  {isUploading ? 'Uploading your media...' : 
                   isDragActive ? 'Drop it here!' : 
                   'Upload your media'}
                </h3>
                <p className="text-luxury-muted">
                  {isUploading 
                    ? 'Please wait while we process your file'
                    : isDragActive 
                    ? 'Release to upload'
                    : 'Drag and drop or click to select'
                  }
                </p>
                {!isAvatar && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-4 text-xs text-luxury-muted/80"
                  >
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      <span>Images</span>
                    </div>
                    <div className="w-1 h-1 bg-luxury-muted/40 rounded-full" />
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>Videos (auto-loop)</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {!isUploading && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10 rounded-2xl px-8 backdrop-blur-sm"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Choose File
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Enhanced Format Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 text-xs"
          >
            <div className="text-center p-4 rounded-2xl bg-luxury-darker/30 border border-luxury-primary/10">
              <ImageIcon className="w-6 h-6 mx-auto mb-2 text-luxury-primary/60" />
              <div className="font-medium text-luxury-neutral mb-1">Images</div>
              <div className="text-luxury-muted">JPG, PNG, GIF, WebP</div>
              <div className="text-luxury-muted/60 mt-1">
                {isAvatar ? 'Square images work best' : 'Recommended: 1500x500px'}
              </div>
            </div>
            {!isAvatar && (
              <div className="text-center p-4 rounded-2xl bg-luxury-darker/30 border border-luxury-accent/10">
                <Video className="w-6 h-6 mx-auto mb-2 text-luxury-accent/60" />
                <div className="font-medium text-luxury-neutral mb-1">Videos</div>
                <div className="text-luxury-muted">MP4, WebM, MOV</div>
                <div className="text-luxury-muted/60 mt-1">Auto-loops seamlessly</div>
              </div>
            )}
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 pt-4"
          >
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 border-luxury-neutral/20 text-luxury-neutral hover:bg-luxury-neutral/5 rounded-2xl h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white rounded-2xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : selectedFile ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Upload {fileType === 'video' ? 'Video' : 'Image'}
                </>
              ) : (
                'Select Media'
              )}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
