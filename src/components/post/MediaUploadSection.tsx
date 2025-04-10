
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { uploadFileToStorage } from "@/utils/mediaUtils";

interface MediaUploadSectionProps {
  onMediaSelect: (urls: string[]) => void;
  isUploading: boolean;
}

export const MediaUploadSection = ({ onMediaSelect, isUploading }: MediaUploadSectionProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  const session = useSession();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !session?.user?.id) return;

    setSelectedFiles(files);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Create optimized version of image if it's too large
        let fileToUpload = file;
        if (file.type.startsWith('image/') && file.size > 1024 * 1024) {
          fileToUpload = await optimizeImage(file);
        }

        // Upload to Supabase storage
        const result = await uploadFileToStorage(fileToUpload, 'media', session.user.id);
        
        if (!result.success || !result.url) {
          throw new Error(result.error || "Failed to upload file");
        }
        
        return result.url;
      });

      const urls = await Promise.all(uploadPromises);
      onMediaSelect(urls);

      toast({
        title: "Media uploaded",
        description: "Your media has been uploaded successfully to storage",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload media. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSelectedFiles(null);
    }
  }, [onMediaSelect, toast, session?.user?.id]);

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

  return (
    <div className="space-y-4">
      <input
        type="file"
        id="media-upload"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full h-32 relative border-dashed border-2"
        onClick={() => document.getElementById('media-upload')?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImagePlus className="h-6 w-6" />
            <span>Upload Media</span>
          </div>
        )}
      </Button>

      {selectedFiles && (
        <div className="text-sm text-muted-foreground">
          {Array.from(selectedFiles).map((file, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{file.name}</span>
              <span className="text-xs">({Math.round(file.size / 1024)}KB)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
