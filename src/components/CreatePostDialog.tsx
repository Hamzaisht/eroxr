
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostForm } from "./CreatePostDialog/PostForm";
import { MediaUploadDisplay } from "./CreatePostDialog/MediaUploadDisplay";
import { useCreatePost } from "./CreatePostDialog/hooks/useCreatePost";

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
            isLoading={isLoading}
            characterLimit={characterLimit}
            charactersUsed={charactersUsed}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
          
          <MediaUploadDisplay
            selectedFiles={selectedFiles}
            onFileSelect={onFileSelect}
            onUploadComplete={handleMediaUploadComplete}
            onUploadStart={handleMediaUploadStart}
            uploadInProgress={uploadInProgress}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            uploadedAssetIds={uploadedAssetIds}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
