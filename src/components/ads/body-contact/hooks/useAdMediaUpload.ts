import { useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { runFileDiagnostic } from "@/utils/upload/fileUtils";
import { uploadMediaToSupabase } from "@/utils/media/uploadUtils";
import { MediaAccessLevel } from "@/utils/media/types";

interface MediaUploadResult {
  videoUrl: string | null;
  avatarUrl: string | null;
  error?: string;
}

export const useAdMediaUpload = () => {
  const session = useSession();
  // Critical: Use refs instead of state for file objects
  const videoFileRef = useRef<File | null>(null);
  const avatarFileRef = useRef<File | null>(null);

  const setVideoFile = (file: File | null) => {
    videoFileRef.current = file;
  };

  const setAvatarFile = (file: File | null) => {
    avatarFileRef.current = file;
  };

  const uploadMedia = async (): Promise<MediaUploadResult> => {
    if (!session?.user?.id) {
      return { videoUrl: null, avatarUrl: null, error: "No user session found" };
    }

    let videoUrl = null;
    let avatarUrl = null;

    try {
      // Video Upload Process
      if (videoFileRef.current) {
        const videoFile = videoFileRef.current;
        
        // CRITICAL: Run comprehensive file diagnostic
        runFileDiagnostic(videoFile);
        
        // CRITICAL: Strict file validation
        if (!videoFile || !(videoFile instanceof File) || videoFile.size === 0) {
          console.error("❌ Invalid Video File passed to uploader", videoFile);
          throw new Error("Only raw File instances with data can be uploaded");
        }
        
        // Validate file type
        const isValidVideoType = videoFile.type.startsWith("video/");
        if (!isValidVideoType) {
          throw new Error(`Invalid file type: ${videoFile.type}. Only videos are allowed.`);
        }
        
        // Use the centralized upload utility
        const videoResult = await uploadMediaToSupabase(
          videoFile,
          'media',
          {
            maxSizeMB: 100,
            accessLevel: MediaAccessLevel.PUBLIC
          }
        );
        
        if (!videoResult.success || !videoResult.url) {
          throw new Error("Failed to upload video");
        }
        
        videoUrl = videoResult.url;
        console.log("Generated video URL:", videoUrl);
      }

      // Avatar Upload Process
      if (avatarFileRef.current) {
        const avatarFile = avatarFileRef.current;
        
        // CRITICAL: Run comprehensive file diagnostic
        runFileDiagnostic(avatarFile);
        
        // CRITICAL: Strict file validation
        if (!avatarFile || !(avatarFile instanceof File) || avatarFile.size === 0) {
          console.error("❌ Invalid Avatar File passed to uploader", avatarFile);
          throw new Error("Only raw File instances with data can be uploaded");
        }
        
        // Validate file type
        const isValidImageType = avatarFile.type.startsWith("image/");
        if (!isValidImageType) {
          throw new Error(`Invalid file type: ${avatarFile.type}. Only images are allowed for avatars.`);
        }
        
        // Use the centralized upload utility
        const avatarResult = await uploadMediaToSupabase(
          avatarFile,
          'media',
          {
            maxSizeMB: 5,
            accessLevel: MediaAccessLevel.PUBLIC
          }
        );
        
        if (!avatarResult.success || !avatarResult.url) {
          throw new Error("Failed to upload avatar");
        }
        
        avatarUrl = avatarResult.url;
        console.log("Generated avatar URL:", avatarUrl);
      }

      return { videoUrl, avatarUrl };
    } catch (error: any) {
      console.error("Media upload error:", error);
      return { videoUrl: null, avatarUrl: null, error: error.message };
    }
  };

  return { 
    uploadMedia, 
    setVideoFile, 
    setAvatarFile 
  };
};
