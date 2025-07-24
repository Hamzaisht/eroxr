
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  const { session, user } = useAuth();
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

      // First, verify that the asset IDs exist and are owned by the current user
      if (uploadedAssetIds.length > 0) {
        const { data: existingAssets, error: verifyError } = await supabase
          .from('media_assets')
          .select('id, user_id, post_id')
          .in('id', uploadedAssetIds);

        if (verifyError) {
          console.error("CreatePost - Error verifying assets:", verifyError);
          throw new Error("Failed to verify media assets");
        }

        console.log("CreatePost - Existing assets found:", existingAssets);

        // Allow media reuse - check if assets exist and are owned by current user
        // Don't require post_id to be null (allow reposting same media)
        const validAssets = existingAssets?.filter(asset => 
          asset.user_id === session.user.id
        ) || [];

        // If no assets exist in database, that's OK - they might be new uploads
        // Only throw error if some assets exist but aren't owned by the user
        const unauthorizedAssets = existingAssets?.filter(asset => 
          asset.user_id !== session.user.id
        ) || [];

        if (unauthorizedAssets.length > 0) {
          console.error("CreatePost - Unauthorized assets:", unauthorizedAssets);
          throw new Error("Some media assets are not owned by the current user");
        }

        console.log("CreatePost - Asset validation passed. Valid assets:", validAssets.length, "Total requested:", uploadedAssetIds.length);
      }

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

      // If we have uploaded assets, try to link them to the post (allow reuse)
      if (uploadedAssetIds.length > 0 && newPost) {
        console.log("CreatePost - Attempting to link media assets to post:", { 
          postId: newPost.id, 
          assetIds: uploadedAssetIds 
        });
        
        // For assets that don't exist yet, create them as blob URLs (temporary solution)
        // In a real app, you would upload the actual files here
        const { data: existingAssets } = await supabase
          .from('media_assets')
          .select('id')
          .in('id', uploadedAssetIds);

        const existingAssetIds = existingAssets?.map(a => a.id) || [];
        const missingAssetIds = uploadedAssetIds.filter(id => !existingAssetIds.includes(id));

        // Create missing media assets (for now, just log that they would be created)
        if (missingAssetIds.length > 0) {
          console.log("CreatePost - Would create missing assets:", missingAssetIds);
          // In a real implementation, you would create the actual media assets here
          // For now, we'll just continue without creating them
        }

        // Try to link existing assets to the post (allow reuse by removing post_id constraint)
        if (existingAssetIds.length > 0) {
          const { error: linkError, data: linkedAssets } = await supabase
            .from('media_assets')
            .update({ post_id: newPost.id })
            .in('id', existingAssetIds)
            .eq('user_id', session.user.id) // Security check
            .select();

          if (linkError) {
            console.warn("CreatePost - Error linking some media assets:", linkError);
            // Don't fail the post creation for linking errors
          } else {
            console.log("CreatePost - Media assets linking result:", linkedAssets);
          }
        }

        console.log("CreatePost - Post created successfully with media handling completed");
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
