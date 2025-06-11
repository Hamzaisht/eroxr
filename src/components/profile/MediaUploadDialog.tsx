
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { MediaUploadHeader } from "./media-upload/MediaUploadHeader";
import { MediaPreview } from "./media-upload/MediaPreview";
import { UploadArea } from "./media-upload/UploadArea";
import { FormatInfo } from "./media-upload/FormatInfo";
import { ActionButtons } from "./media-upload/ActionButtons";

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
      console.log('File selected:', file.name, file.type, file.size);
      setSelectedFile(file);
      
      // Clean up previous preview URL
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  }, [preview]);

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
    disabled: isUploading,
    maxSize: type === 'banner' ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 50MB for banner, 10MB for avatar
  });

  const handleUpload = async () => {
    if (selectedFile && !isUploading) {
      try {
        console.log('Starting upload for:', selectedFile.name);
        await onUpload(selectedFile);
        handleClose();
      } catch (error) {
        console.error('Upload failed in dialog:', error);
      }
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      // Clean up preview URL
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setSelectedFile(null);
      setFileType(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 border-none bg-transparent overflow-hidden fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full h-full bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-dark backdrop-blur-xl border border-luxury-primary/30 shadow-2xl rounded-3xl overflow-hidden"
        >
          <MediaUploadHeader
            type={type}
            onClose={handleClose}
            isUploading={isUploading}
          />

          <div className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-120px)]">
            <MediaPreview
              currentUrl={currentUrl}
              preview={preview}
              fileType={fileType}
              type={type}
            />

            <UploadArea
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              isUploading={isUploading}
              type={type}
            />

            <FormatInfo type={type} />

            <ActionButtons
              selectedFile={selectedFile}
              isUploading={isUploading}
              fileType={fileType}
              onClose={handleClose}
              onUpload={handleUpload}
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
