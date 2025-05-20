import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { createUniqueFilePath, uploadFileToStorage } from "@/utils/media/mediaUtils";

interface UseStoryUploadProps {
  onUploadComplete?: () => void;
}

export const useStoryUpload = ({ onUploadComplete }: UseStoryUploadProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();

  const uploadStory = useCallback(async (file: File) => {
    if (!session?.user?.id) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to upload a story.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create optimized version of image if it's too large
      let fileToUpload = file;
      if (file.type.startsWith('image/') && file.size > 1024 * 1024) {
        fileToUpload = await optimizeImage(file);
      }

      // Upload to Supabase storage
      const bucket = 'stories';
      const userId = session.user.id;
      const path = createUniqueFilePath(userId, fileToUpload);
      const result = await uploadFileToStorage(bucket, path, fileToUpload);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Failed to upload story");
      }

      toast({
        title: "Story uploaded",
        description: "Your story has been uploaded successfully.",
      });
      
      // Refresh the router to update server components
      router.refresh();

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [session?.user?.id, toast, router, onUploadComplete]);

  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxDimension = 1920;
        
        if (width > height && width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          }
        }, 'image/jpeg', 0.85); // Adjust quality as needed
        
        URL.revokeObjectURL(img.src);
      };
    });
  };

  return { uploadStory, isUploading };
};
