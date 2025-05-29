
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "./CreatePostDialog/PostForm";
import { MediaUploadDisplay } from "./CreatePostDialog/MediaUploadDisplay";
import { useCreatePost } from "./CreatePostDialog/hooks/useCreatePost";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

export const CreatePostDialog = ({ open, onOpenChange, selectedFiles, onFileSelect }: CreatePostDialogProps) => {
  const {
    content,
    setContent,
    visibility,
    setVisibility,
    isLoading,
    setIsLoading,
    uploadedAssetIds,
    uploadInProgress,
    uploadError,
    uploadSuccess,
    characterLimit,
    canSubmit,
    handleMediaUploadComplete,
    handleMediaUploadStart,
    resetForm,
    session,
    toast
  } = useCreatePost();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onFileSelect(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() && uploadedAssetIds.length === 0) {
      toast({
        title: "Error",
        description: "Post must have content or media",
        variant: "destructive",
      });
      return;
    }

    if (content.length > characterLimit) {
      toast({
        title: "Error",
        description: `Post content cannot exceed ${characterLimit} characters`,
        variant: "destructive",
      });
      return;
    }

    if (uploadInProgress) {
      toast({
        title: "Error",
        description: "Please wait for media upload to complete",
        variant: "destructive",
      });
      return;
    }

    if (uploadError) {
      toast({
        title: "Error",
        description: `Media upload failed: ${uploadError}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const postData = {
        content: content.trim(),
        creator_id: session.user.id,
        visibility: visibility,
        likes_count: 0,
        comments_count: 0,
        view_count: 0,
        share_count: 0,
        engagement_score: 0.0,
        is_ppv: false,
        is_featured: false,
        metadata: {
          has_media: uploadedAssetIds.length > 0,
          media_count: uploadedAssetIds.length,
          upload_session: Date.now(),
          created_via: 'dialog'
        }
      };

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (postError) {
        console.error('CreatePostDialog - Post creation error:', postError);
        throw new Error(`Failed to create post: ${postError.message}`);
      }

      if (uploadedAssetIds.length > 0 && post.id) {
        let successCount = 0;
        const linkingErrors: string[] = [];
        
        for (const assetId of uploadedAssetIds) {
          try {
            const { data: currentAsset, error: fetchError } = await supabase
              .from('media_assets')
              .select('id, metadata, user_id, created_at')
              .eq('id', assetId)
              .eq('user_id', session.user.id)
              .single();

            if (fetchError || !currentAsset) {
              linkingErrors.push(`Asset ${assetId}: not found or access denied`);
              continue;
            }

            const updatedMetadata = {
              ...(currentAsset.metadata || {}),
              post_id: post.id,
              usage: 'post',
              linked_at: new Date().toISOString(),
              linked_by_user: session.user.id,
              post_created_at: post.created_at,
              linking_method: 'dialog_upload'
            };

            const { error: updateError } = await supabase
              .from('media_assets')
              .update({ metadata: updatedMetadata })
              .eq('id', assetId)
              .eq('user_id', session.user.id);

            if (updateError) {
              linkingErrors.push(`Asset ${assetId}: ${updateError.message}`);
            } else {
              successCount++;
            }
          } catch (error) {
            linkingErrors.push(`Asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        
        if (successCount === 0 && uploadedAssetIds.length > 0) {
          toast({
            title: "Warning",
            description: "Post created but media linking failed. Media may not appear.",
            variant: "destructive"
          });
        } else if (successCount < uploadedAssetIds.length) {
          toast({
            title: "Partial Success",
            description: `Post created with ${successCount}/${uploadedAssetIds.length} media files linked`,
          });
        }
      }

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      resetForm();
      onFileSelect(null);
      onOpenChange(false);

    } catch (error: any) {
      console.error('CreatePostDialog - Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <PostForm
            content={content}
            setContent={setContent}
            visibility={visibility}
            setVisibility={setVisibility}
            characterLimit={characterLimit}
          />

          {/* Media Upload Section - Always visible */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Add Media</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('media-upload')?.click()}
                disabled={isLoading || uploadInProgress}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
            
            <input
              id="media-upload"
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {selectedFiles && selectedFiles.length > 0 && (
              <MediaUploadDisplay
                selectedFiles={selectedFiles}
                uploadError={uploadError}
                uploadSuccess={uploadSuccess}
                uploadInProgress={uploadInProgress}
                uploadedAssetIds={uploadedAssetIds}
                onUploadComplete={handleMediaUploadComplete}
                onUploadStart={handleMediaUploadStart}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || uploadInProgress}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!canSubmit}
              className="min-w-[100px]"
            >
              {isLoading ? "Creating..." : uploadInProgress ? "Uploading..." : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
