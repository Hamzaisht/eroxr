
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostForm } from "./CreatePostDialog/PostForm";
import { MediaUploadDisplay } from "./CreatePostDialog/MediaUploadDisplay";
import { useCreatePost } from "./CreatePostDialog/hooks/useCreatePost";
import { Button } from "@/components/ui/button";

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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-luxury-darker border-luxury-neutral/20">
        <div className="space-y-6">
          <PostForm
            content={content}
            setContent={setContent}
            visibility={visibility}
            setVisibility={setVisibility}
            characterLimit={characterLimit}
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

          <div className="flex justify-end gap-3 pt-4 border-t border-luxury-neutral/10">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-luxury-neutral/20 text-luxury-neutral hover:bg-luxury-neutral/10"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-luxury-primary hover:bg-luxury-primary/90 text-white"
            >
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
