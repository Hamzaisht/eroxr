
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCreatePost = () => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "subscribers_only" | "private" | "hidden">("public");
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
    
    if (urls.length !== assetIds.length) {
      console.error("CreatePostDialog - Mismatch between URLs and asset IDs:", { urls, assetIds });
      setUploadError("Media upload validation failed - mismatched data");
      return;
    }
    
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

  const createPost = async (onSuccess?: () => void) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() && uploadedAssetIds.length === 0) {
      toast({
        title: "Content required",
        description: "Please add some content or media to your post",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("CreatePost - Creating post with asset IDs:", uploadedAssetIds);

      // Create the post first
      const { data: newPost, error: postError } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
          creator_id: session.user.id,
          visibility,
        })
        .select()
        .single();

      if (postError) {
        console.error("CreatePost - Error creating post:", postError);
        throw new Error(postError.message);
      }

      console.log("CreatePost - Post created successfully:", newPost);

      // If we have uploaded assets, link them to the post with better error handling
      if (uploadedAssetIds.length > 0) {
        console.log("CreatePost - Linking media assets to post:", { postId: newPost.id, assetIds: uploadedAssetIds });
        
        // First verify the assets exist and are owned by the current user
        const { data: existingAssets, error: verifyError } = await supabase
          .from('media_assets')
          .select('id, user_id, post_id')
          .in('id', uploadedAssetIds)
          .eq('user_id', session.user.id);

        if (verifyError) {
          console.error("CreatePost - Error verifying media assets:", verifyError);
          throw new Error("Failed to verify media assets");
        }

        if (!existingAssets || existingAssets.length === 0) {
          console.error("CreatePost - No valid media assets found for IDs:", uploadedAssetIds);
          throw new Error("No valid media assets found to link");
        }

        const assetsToLink = existingAssets.filter(asset => !asset.post_id);
        
        if (assetsToLink.length === 0) {
          console.warn("CreatePost - All assets are already linked to posts");
        } else {
          const { error: linkError } = await supabase
            .from('media_assets')
            .update({ post_id: newPost.id })
            .in('id', assetsToLink.map(asset => asset.id));

          if (linkError) {
            console.error("CreatePost - Error linking media assets:", linkError);
            // Don't fail the post creation, but log the error
            toast({
              title: "Warning",
              description: "Post created but some media may not be linked properly",
              variant: "destructive",
            });
          } else {
            console.log("CreatePost - Media assets linked successfully:", assetsToLink.length);
          }
        }
      }

      toast({
        title: "Success",
        description: "Your post has been created!",
      });

      // Reset form
      resetForm();
      onSuccess?.();

    } catch (error: any) {
      console.error("CreatePost - Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setContent("");
    setVisibility("public");
    setUploadedAssetIds([]);
    setUploadInProgress(false);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const canSubmit = !isLoading && 
                   !uploadInProgress && 
                   !uploadError &&
                   (content.trim().length > 0 || uploadedAssetIds.length > 0) &&
                   charactersUsed <= characterLimit;

  return {
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
    charactersUsed,
    canSubmit,
    handleMediaUploadComplete,
    handleMediaUploadStart,
    resetForm,
    createPost,
    session,
    toast
  };
};
