
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { AdFormValues } from "../types";
import { validateAdSubmission } from "./useAdValidation";
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

    console.log("Form values submitted:", values);
    console.log("isSuperAdmin value:", isSuperAdmin, "type:", typeof isSuperAdmin);
    
    setIsLoading(true);

    try {
      // 1. Validate form values
      const validation = validateAdSubmission(values);
      if (!validation.isValid) {
        throw new Error(validation.error || "Invalid form data");
      }

      // 2. Check user permissions (premium, verification)
      const permissionCheck = await checkPermissions(session.user.id, isSuperAdmin === true);
      if (!permissionCheck.isAllowed) {
        toast({
          title: "Access restricted",
          description: permissionCheck.error || "Permission denied",
          variant: "destructive",
        });
        return;
      }

      // 3. Save ad to the database without media
      const superAdminFlag = isSuperAdmin === true;
      
      const saveResult = await saveAd(
        values, 
        null, // No video URL
        null, // No avatar URL
        superAdminFlag
      );
      
      if (!saveResult.success || !saveResult.data) {
        throw new Error(saveResult.error || "Failed to save ad");
      }

      // 4. Show success message and trigger callbacks
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
