
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCreatePost = () => {
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
    session,
    toast
  };
};
