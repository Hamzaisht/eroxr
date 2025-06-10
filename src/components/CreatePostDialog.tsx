
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostForm } from "./CreatePostDialog/PostForm";
import { MediaUploadDisplay } from "./CreatePostDialog/MediaUploadDisplay";
import { useCreatePost } from "./CreatePostDialog/hooks/useCreatePost";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, X, Image, Video, Camera } from "lucide-react";
import { useRef } from "react";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles?: FileList | null;
  onFileSelect?: (files: FileList | null) => void;
}

export const CreatePostDialog = ({ 
  open, 
  onOpenChange,
  selectedFiles,
  onFileSelect 
}: CreatePostDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    content,
    setContent,
    visibility,
    setVisibility,
    isLoading,
    uploadedAssetIds,
    uploadInProgress,
    uploadError,
    uploadSuccess,
    characterLimit,
    charactersUsed,
    canSubmit,
    handleMediaUploadComplete,
    handleMediaUploadStart,
    createPost,
    resetForm
  } = useCreatePost();

  const handleSubmit = async () => {
    await createPost(() => {
      onOpenChange(false);
    });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleMediaSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && onFileSelect) {
      onFileSelect(files);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-dark border border-luxury-primary/20 backdrop-blur-xl">
        <div className="relative">
          {/* Animated background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/5 via-luxury-accent/5 to-luxury-secondary/5 rounded-lg" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-luxury-primary/50 to-transparent" />
          
          {/* Header */}
          <motion.div 
            className="relative flex items-center justify-between p-6 pb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-luxury-primary" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
                  Create New Post
                </h2>
                <p className="text-sm text-luxury-muted">Share your creative vision with the world</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-luxury-neutral hover:bg-luxury-neutral/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Content */}
          <div className="relative px-6 space-y-6">
            <PostForm
              content={content}
              setContent={setContent}
              visibility={visibility}
              setVisibility={setVisibility}
              characterLimit={characterLimit}
            />
            
            {/* Media Attachment Section */}
            <div className="flex items-center gap-3 p-4 border border-luxury-primary/20 rounded-xl bg-luxury-darker/50">
              <span className="text-sm text-luxury-muted">Add to your post:</span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMediaSelect}
                className="text-luxury-accent hover:bg-luxury-accent/10"
              >
                <Image className="h-4 w-4 mr-2" />
                Photo
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMediaSelect}
                className="text-luxury-secondary hover:bg-luxury-secondary/10"
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMediaSelect}
                className="text-luxury-primary hover:bg-luxury-primary/10"
              >
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </Button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {selectedFiles && (
              <MediaUploadDisplay
                selectedFiles={selectedFiles}
                onUploadComplete={handleMediaUploadComplete}
                onUploadStart={handleMediaUploadStart}
                uploadInProgress={uploadInProgress}
                uploadError={uploadError}
                uploadSuccess={uploadSuccess}
                uploadedAssetIds={uploadedAssetIds}
              />
            )}

            {/* Footer */}
            <motion.div 
              className="flex justify-end gap-3 pt-4 border-t border-luxury-primary/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="border-luxury-primary/20 text-luxury-neutral hover:bg-luxury-primary/10 hover:border-luxury-primary/40"
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white shadow-luxury"
              >
                {isLoading ? (
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                    Creating...
                  </motion.div>
                ) : (
                  "Create Post"
                )}
              </Button>
            </motion.div>
          </div>
          
          {/* Character count indicator */}
          {charactersUsed > 0 && (
            <motion.div 
              className="absolute bottom-16 right-6 text-xs text-luxury-muted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {charactersUsed}/{characterLimit}
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
