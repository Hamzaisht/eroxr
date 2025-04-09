
import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video, CheckCircle2 } from "lucide-react";
import { UploadProgress } from "@/components/ui/UploadProgress";
import { motion } from "framer-motion";
import { useVideoDialogState } from "./hooks/useVideoDialogState";
import { VideoPreview } from "./components/VideoPreview";
import { VideoFileSelector } from "./components/VideoFileSelector";
import { VideoFormFields } from "./components/VideoFormFields";
import { ValidationMessage } from "./components/ValidationMessage";
import { VideoDialogActions } from "./components/VideoDialogActions";

interface UploadVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadVideoDialog = ({ open, onOpenChange }: UploadVideoDialogProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    state,
    isSubmitting,
    uploadProgress,
    isUploading,
    isError,
    errorMessage,
    uploadComplete,
    handleFileSelect,
    handleTitleChange,
    handleDescriptionChange,
    handleIsPremiumChange,
    handleVideoLoad,
    handleVideoError,
    handleUpload,
    handleCancel,
    clearVideo
  } = useVideoDialogState(open, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Video className="h-5 w-5 text-luxury-primary" />
            Upload Eros Video
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid w-full gap-2">
            <label htmlFor="video">Upload Video</label>
            
            {state.previewUrl ? (
              <VideoPreview
                previewUrl={state.previewUrl}
                videoRef={videoRef}
                isPreviewLoading={state.isPreviewLoading}
                previewError={state.previewError}
                onVideoLoad={handleVideoLoad}
                onVideoError={handleVideoError}
                onClear={clearVideo}
              />
            ) : (
              <VideoFileSelector
                fileInputRef={fileInputRef}
                isSubmitting={isSubmitting}
                onFileSelect={handleFileSelect}
              />
            )}
            
            <ValidationMessage message={state.validationError} />
          </div>

          <VideoFormFields
            title={state.title}
            description={state.description}
            isPremium={state.isPremium}
            onTitleChange={handleTitleChange}
            onDescriptionChange={handleDescriptionChange}
            onIsPremiumChange={handleIsPremiumChange}
          />

          <UploadProgress 
            isUploading={isUploading}
            progress={uploadProgress}
            isComplete={uploadComplete}
            isError={isError}
            errorMessage={errorMessage}
            onRetry={handleUpload}
          />

          {uploadComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-950/30 text-green-400 p-3 rounded-md flex items-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Upload complete! Your video will be available soon.</span>
            </motion.div>
          )}
        </div>

        <VideoDialogActions
          onCancel={handleCancel}
          onUpload={handleUpload}
          isSubmitting={isSubmitting}
          isValid={!!state.selectedFile && !!state.title}
          isComplete={uploadComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
