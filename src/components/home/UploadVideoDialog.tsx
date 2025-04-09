
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2, Upload, Video, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShortPostSubmit } from "./hooks/useShortPostSubmit";
import { Switch } from "@/components/ui/switch";
import { UploadProgress } from "@/components/ui/UploadProgress";
import { motion, AnimatePresence } from "framer-motion";

interface UploadVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadVideoDialog = ({ open, onOpenChange }: UploadVideoDialogProps) => {
  // State for form fields and UI
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Hooks
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  const { 
    submitShortPost, 
    isSubmitting, 
    uploadProgress, 
    isUploading, 
    isError, 
    errorMessage,
    resetUploadState
  } = useShortPostSubmit();

  // Constants
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

  // Reset form on open/close
  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
      setUploadComplete(false);
      setValidationError(null);
      setPreviewError(null);
      resetUploadState();
    }
  }, [open, resetUploadState]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("Selected file:", file.name, file.type, file.size);

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setValidationError(`Please upload a video file (MP4, WebM, or MOV). Selected type: ${file.type}`);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setValidationError(`Video size must be less than 100MB. Selected size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    setValidationError(null);
    setPreviewError(null);
    setSelectedFile(file);
    
    // Create and set preview URL
    try {
      setIsPreviewLoading(true);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Show a toast when file is valid and selected
      toast({
        title: "Video selected",
        description: "Preview is being prepared...",
      });
      
      console.log("Created preview URL:", objectUrl);
    } catch (error) {
      console.error("Error creating preview URL:", error);
      setPreviewError("Could not generate video preview");
      setIsPreviewLoading(false);
    }
  };

  // Handle video preview loading
  const handleVideoLoad = () => {
    console.log("Video preview loaded successfully");
    setIsPreviewLoading(false);
    toast({
      title: "Video preview ready",
      description: "You can now add details and upload",
    });
  };

  // Handle video preview error
  const handleVideoError = () => {
    console.error("Video preview failed to load");
    setIsPreviewLoading(false);
    setPreviewError("Failed to preview video. The format may be unsupported.");
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Handle form submission
  const handleUpload = async () => {
    if (!session?.user?.id || !selectedFile) return;
    
    if (!title.trim()) {
      setValidationError("Please enter a title for your video");
      return;
    }

    try {
      console.log("Starting upload process with file:", selectedFile.name, selectedFile.type);
      const success = await submitShortPost({
        title,
        description: description.trim() || undefined,
        videoFile: selectedFile,
        isPremium
      });

      if (success) {
        setUploadComplete(true);
        
        toast({
          title: "Upload successful",
          description: "Your Eros video is now being processed and will be available soon.",
        });
        
        // Navigate to shorts feed after successful upload with a slight delay
        setTimeout(() => {
          onOpenChange(false);
          navigate('/shorts');
        }, 1500);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error?.message || "There was a problem uploading your video. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle dialog cancel
  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    onOpenChange(false);
  };

  // Clear selected video
  const clearVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
      setPreviewError(null);
    }
  };

  // Safe handlers for input fields to fix the typing bug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    console.log("Title updated:", e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    console.log("Description updated:", e.target.value);
  };

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
            <Label htmlFor="video">Upload Video</Label>
            
            {previewUrl ? (
              <div className="relative bg-luxury-darker rounded-lg overflow-hidden aspect-[9/16] max-h-[300px]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isPreviewLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80 z-10">
                      <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
                    </div>
                  )}
                  
                  {previewError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
                      <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                      <p className="text-sm text-white/90 text-center">{previewError}</p>
                      <Button
                        onClick={clearVideo}
                        variant="outline"
                        className="mt-4"
                        size="sm"
                      >
                        Select Another Video
                      </Button>
                    </div>
                  ) : (
                    <video 
                      ref={videoRef}
                      src={previewUrl} 
                      className="w-full h-full object-contain"
                      controls
                      onLoadedData={handleVideoLoad}
                      onError={handleVideoError}
                    />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1.5"
                    onClick={clearVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div 
                className="flex flex-col items-center"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  ref={fileInputRef}
                  id="video"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 rounded-lg border-2 border-dashed border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-luxury-primary" />
                    <span>Click to select video</span>
                    <span className="text-xs text-luxury-neutral/60">
                      MP4, WebM, or MOV (max 100MB)
                    </span>
                  </div>
                </Button>
              </motion.div>
            )}
            
            <AnimatePresence>
              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  {validationError}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="title" className="required">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="bg-transparent"
                placeholder="Add a title to your video"
                maxLength={100}
                required
              />
              <div className="text-xs text-right text-luxury-neutral/60">
                {title.length}/100
              </div>
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                className="bg-transparent"
                placeholder="Describe your video"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-right text-luxury-neutral/60">
                {description.length}/500
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="premium-toggle"
                checked={isPremium}
                onCheckedChange={setIsPremium}
              />
              <Label htmlFor="premium-toggle">
                Make this Eros video Premium (59 SEK/month subscribers only)
              </Label>
            </div>
          </div>

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

        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !title || isSubmitting || uploadComplete}
            className="bg-luxury-primary hover:bg-luxury-primary/80"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : uploadComplete ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete
              </>
            ) : (
              'Post Eros'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
