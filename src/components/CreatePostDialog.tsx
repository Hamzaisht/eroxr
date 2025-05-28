
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MediaUploadSection } from "@/components/post/MediaUploadSection";
import { X, Image, Video, AlertCircle, CheckCircle } from "lucide-react";
import { MediaAccessLevel } from "@/utils/media/types";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

export const CreatePostDialog = ({ open, onOpenChange, selectedFiles, onFileSelect }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "subscribers_only">("public");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedAssetIds, setUploadedAssetIds] = useState<string[]>([]);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const characterLimit = 2000;
  const charactersUsed = content.length;

  const handleMediaUploadComplete = (urls: string[], assetIds: string[]) => {
    console.log("CreatePostDialog - Media upload completed:", { 
      urls: urls.length, 
      assetIds: assetIds.length,
      actualAssetIds: assetIds 
    });
    
    // Validate that we have matching URLs and asset IDs
    if (urls.length !== assetIds.length) {
      console.error("CreatePostDialog - Mismatch between URLs and asset IDs:", { urls, assetIds });
      setUploadError("Media upload validation failed - mismatched data");
      return;
    }
    
    // Validate asset IDs are valid UUIDs
    const validAssetIds = assetIds.filter(id => {
      const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (!isValid) {
        console.error("CreatePostDialog - Invalid asset ID:", id);
      }
      return isValid;
    });
    
    if (validAssetIds.length !== assetIds.length) {
      setUploadError("Some media assets have invalid IDs");
      return;
    }
    
    setUploadedAssetIds(validAssetIds);
    setUploadInProgress(false);
    setUploadError(null);
    setUploadSuccess(true);
    
    console.log("CreatePostDialog - Asset IDs successfully stored:", validAssetIds);
  };

  const handleMediaUploadStart = () => {
    console.log("CreatePostDialog - Media upload started");
    setUploadInProgress(true);
    setUploadError(null);
    setUploadSuccess(false);
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

    // Check if media upload is still in progress
    if (uploadInProgress) {
      toast({
        title: "Error",
        description: "Please wait for media upload to complete",
        variant: "destructive",
      });
      return;
    }

    // Check for upload errors
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
      console.log("CreatePostDialog - Creating post with data:", {
        content: content.trim(),
        creator_id: session.user.id,
        visibility,
        uploadedAssetIds: uploadedAssetIds.length,
        actualAssetIds: uploadedAssetIds
      });

      // Create post with enhanced metadata
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

      console.log("CreatePostDialog - Inserting post data:", postData);

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (postError) {
        console.error('CreatePostDialog - Post creation error:', postError);
        throw new Error(`Failed to create post: ${postError.message}`);
      }

      console.log("CreatePostDialog - Post created successfully:", post);

      // CRITICAL: Link media assets to the post if we have any
      if (uploadedAssetIds.length > 0 && post.id) {
        console.log("CreatePostDialog - Linking media assets to post:", { 
          postId: post.id, 
          assetCount: uploadedAssetIds.length,
          assetIds: uploadedAssetIds 
        });
        
        let successCount = 0;
        const linkingErrors: string[] = [];
        
        for (const assetId of uploadedAssetIds) {
          try {
            // Verify the asset exists and belongs to the current user
            const { data: currentAsset, error: fetchError } = await supabase
              .from('media_assets')
              .select('id, metadata, user_id, created_at')
              .eq('id', assetId)
              .eq('user_id', session.user.id)
              .single();

            if (fetchError) {
              console.error(`CreatePostDialog - Asset ${assetId} fetch error:`, fetchError);
              linkingErrors.push(`Asset ${assetId}: ${fetchError.message}`);
              continue;
            }

            if (!currentAsset) {
              console.error(`CreatePostDialog - Asset ${assetId} not found or not owned by user`);
              linkingErrors.push(`Asset ${assetId}: not found or access denied`);
              continue;
            }

            // Update the asset metadata to link it to the post
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
              console.error(`CreatePostDialog - Asset ${assetId} linking error:`, updateError);
              linkingErrors.push(`Asset ${assetId}: ${updateError.message}`);
            } else {
              successCount++;
              console.log(`CreatePostDialog - Successfully linked asset ${assetId} to post ${post.id}`);
            }
          } catch (error) {
            console.error(`CreatePostDialog - Exception linking asset ${assetId}:`, error);
            linkingErrors.push(`Asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        
        console.log(`CreatePostDialog - Asset linking complete: ${successCount}/${uploadedAssetIds.length} successful`);
        
        if (linkingErrors.length > 0) {
          console.error("CreatePostDialog - Asset linking errors:", linkingErrors);
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

      // Reset form completely
      setContent("");
      setVisibility("public");
      setUploadedAssetIds([]);
      setUploadInProgress(false);
      setUploadError(null);
      setUploadSuccess(false);
      onFileSelect(null);
      
      // Close dialog
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

  // Determine if we can submit the post
  const canSubmit = !isLoading && 
                   !uploadInProgress && 
                   !uploadError &&
                   (content.trim().length > 0 || uploadedAssetIds.length > 0) &&
                   charactersUsed <= characterLimit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div>
            <Label htmlFor="content">What's on your mind?</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, experiences, or exclusive content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={characterLimit}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${charactersUsed > characterLimit * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                {charactersUsed}/{characterLimit}
              </span>
            </div>
          </div>

          {/* Media Upload Section - Always show if we have files */}
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="space-y-4">
              <Label>Media Upload</Label>
              
              {/* Upload Error Display */}
              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-700">{uploadError}</p>
                </div>
              )}

              {/* Upload Success Display */}
              {uploadSuccess && !uploadInProgress && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-green-700">
                    ✓ {uploadedAssetIds.length} media file(s) uploaded successfully
                  </p>
                </div>
              )}

              {/* Upload Status Display */}
              {uploadInProgress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">📤 Uploading media files...</p>
                </div>
              )}

              <MediaUploadSection
                onUploadComplete={handleMediaUploadComplete}
                onUploadStart={handleMediaUploadStart}
                defaultAccessLevel={MediaAccessLevel.PUBLIC}
              />
            </div>
          )}

          {/* Visibility Settings */}
          <div>
            <Label htmlFor="visibility">Post Visibility</Label>
            <Select value={visibility} onValueChange={(value: "public" | "subscribers_only") => setVisibility(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Everyone can see</SelectItem>
                <SelectItem value="subscribers_only">Subscribers Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
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
