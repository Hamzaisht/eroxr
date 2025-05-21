
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { runFileDiagnostic } from "@/utils/upload/fileUtils";
import { validateFileForUpload } from "@/utils/upload/validators";

export const useStorageService = () => {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    folder: string,
    userId: string
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!file || !userId) {
      return { success: false, error: "Missing file or user ID" };
    }

    setIsUploading(true);

    try {
      // Validate file
      const diagnostic = runFileDiagnostic(file);
      
      if (!diagnostic.valid) {
        return { success: false, error: diagnostic.message };
      }

      // Validate file size and type
      const validation = validateFileForUpload(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate a unique file name
      const fileName = `${userId}/${Date.now()}-${file.name}`;

      // Upload the file
      const { data, error } = await supabase.storage
        .from(folder)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get the URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from(folder)
        .getPublicUrl(data.path);

      if (!urlData.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      return { success: true, url: urlData.publicUrl };
    } catch (error: any) {
      console.error("Error uploading file:", error);
      return { 
        success: false, 
        error: error.message || "An error occurred during upload"
      };
    } finally {
      setIsUploading(false);
    }
  };

  // Add uploadVideoToStorage function specifically for shorts
  const uploadVideoToStorage = async (
    userId: string,
    videoFile: File
  ): Promise<{ path?: string; error?: string }> => {
    setIsUploading(true);
    try {
      const result = await uploadFile(videoFile, "shorts", userId);
      
      if (!result.success) {
        return { error: result.error };
      }
      
      return { path: result.url };
    } catch (error: any) {
      console.error("Error uploading video to storage:", error);
      return { error: error.message || "Failed to upload video" };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, uploadVideoToStorage, isUploading };
};
