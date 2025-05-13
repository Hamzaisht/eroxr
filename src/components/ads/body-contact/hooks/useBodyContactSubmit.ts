
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { AdFormValues } from "../types";
import { validateAdSubmission } from "./useAdValidation";
import { useAdMediaUpload } from "./useAdMediaUpload";
import { useAdPermissionCheck } from "./useAdPermissionCheck";
import { useAdDatabaseOperations } from "./useAdDatabaseOperations";

interface UseBodyContactSubmitProps {
  onSuccess?: () => void;
  onComplete?: () => void;
  isSuperAdmin?: boolean;
}

export const useBodyContactSubmit = ({ 
  onSuccess, 
  onComplete,
  isSuperAdmin = false
}: UseBodyContactSubmitProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const { uploadMedia } = useAdMediaUpload();
  const { checkPermissions } = useAdPermissionCheck();
  const { saveAd, saveAdMedia, updateProfileAvatar } = useAdDatabaseOperations();

  const handleSubmit = async (values: AdFormValues) => {
    if (!session?.user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to create a body contact ad",
        variant: "destructive",
      });
      return;
    }

    // Add debug logging to inspect the form values
    console.log("Form values submitted:", values);
    
    setIsLoading(true);

    try {
      // 1. Validate form values
      const validation = validateAdSubmission(values);
      if (!validation.isValid) {
        throw new Error(validation.error || "Invalid form data");
      }

      // 2. Check user permissions (premium, verification)
      const permissionCheck = await checkPermissions(session.user.id);
      if (!permissionCheck.isAllowed) {
        toast({
          title: "Access restricted",
          description: permissionCheck.error || "Permission denied",
          variant: "destructive",
        });
        return;
      }

      // 3. Upload media files (video and avatar)
      const mediaResult = await uploadMedia();
      if (mediaResult.error) {
        throw new Error(mediaResult.error);
      }

      // 4. Save ad to the database
      const saveResult = await saveAd(
        values, 
        mediaResult.videoUrl, 
        mediaResult.avatarUrl,
        isSuperAdmin
      );
      
      if (!saveResult.success || !saveResult.data) {
        throw new Error(saveResult.error || "Failed to save ad");
      }

      // 5. Record ad media
      await saveAdMedia(
        saveResult.data.id, 
        mediaResult.videoUrl, 
        mediaResult.avatarUrl
      );

      // 6. Update user profile avatar if provided
      if (mediaResult.avatarUrl) {
        await updateProfileAvatar(mediaResult.avatarUrl);
      }

      // 7. Show success message and trigger callbacks
      toast({
        title: "Success!",
        description: "Your body contact ad has been published!", 
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error("Error creating ad:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create body contact ad",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
