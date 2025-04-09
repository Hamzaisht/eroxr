
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { getStorageUrl } from "@/utils/mediaUtils";

interface UploadState {
  isUploading: boolean;
  progress: number;
  isComplete: boolean;
  error: string | null;
}

interface UploadResult {
  success: boolean;
  videoUrl?: string;
  error?: string;
}

export const useVideoUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    isComplete: false,
    error: null
  });
  
  const session = useSession();
  const { toast } = useToast();
  
  const resetUploadState = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      isComplete: false,
      error: null
    });
  };

  const uploadVideo = async (
    file: File,
    options?: { 
      onProgress?: (progress: number) => void
    }
  ): Promise<UploadResult> => {
    if (!session?.user?.id) {
      return { 
        success: false, 
        error: "You must be logged in to upload videos"
      };
    }

    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        isComplete: false,
        error: null
      });
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = fileName;
      const bucketName = 'shorts';

      // We'll use the XMLHttpRequest to track progress manually since
      // Supabase's upload method doesn't directly support progress tracking
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadState(prev => ({ ...prev, progress: percent }));
            if (options?.onProgress) {
              options.onProgress(percent);
            }
          }
        });
        
        xhr.addEventListener("error", () => {
          const errorMsg = "Upload failed due to network error";
          setUploadState(prev => ({ 
            ...prev, 
            isUploading: false, 
            error: errorMsg
          }));
          resolve({ 
            success: false, 
            error: errorMsg
          });
        });
        
        xhr.addEventListener("load", async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Generate full public URL using our utility function
            const publicUrl = getStorageUrl(bucketName, filePath);
            
            setUploadState({
              isUploading: false,
              progress: 100,
              isComplete: true,
              error: null
            });
            
            resolve({ 
              success: true, 
              videoUrl: publicUrl
            });
          } else {
            const errorMsg = `Upload failed with status ${xhr.status}`;
            setUploadState(prev => ({ 
              ...prev, 
              isUploading: false, 
              error: errorMsg
            }));
            resolve({ 
              success: false, 
              error: errorMsg
            });
          }
        });
        
        // Start the direct upload to Supabase storage using a signed URL
        (async () => {
          try {
            // Create a signed URL for the upload
            const { data: { signedUrl }, error: signedURLError } = await supabase.storage
              .from(bucketName)
              .createSignedUploadUrl(filePath);
            
            if (signedURLError) {
              throw signedURLError;
            }
            
            // Open the request
            xhr.open('PUT', signedUrl);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
          } catch (error: any) {
            console.error("Signed URL error:", error);
            
            setUploadState(prev => ({ 
              ...prev, 
              isUploading: false, 
              error: error.message || "Failed to get upload URL"
            }));
            
            resolve({ 
              success: false, 
              error: error.message || "Failed to get upload URL"
            });
          }
        })();
      });
    } catch (error: any) {
      console.error("Video upload error:", error);
      
      setUploadState({
        isUploading: false,
        progress: 0,
        isComplete: false,
        error: error.message || "Failed to upload video"
      });
      
      return { 
        success: false, 
        error: error.message || "Failed to upload video"
      };
    }
  };

  return {
    uploadState,
    uploadVideo,
    resetUploadState
  };
};
