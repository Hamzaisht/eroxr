
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/hooks/use-toast";
import { createUniqueFilePath } from "@/utils/upload/fileUtils";
import { uploadFileToStorage } from "@/utils/upload/storageService";

interface NewPostMediaUploadProps {
  onMediaUrlsChange: (urls: string[]) => void;
  onUploadProgress?: (isUploading: boolean) => void;
}

export const NewPostMediaUpload = ({ 
  onMediaUrlsChange,
  onUploadProgress
}: NewPostMediaUploadProps) => {
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !session?.user?.id) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    if (onUploadProgress) onUploadProgress(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Create a unique path for the file
        const path = createUniqueFilePath(file);
        
        // Upload to storage
        const result = await uploadFileToStorage('media', path, file);
        
        if (!result.success || !result.url) {
          throw new Error(result.error || "Failed to upload file");
        }
        
        return result.url;
      });
      
      // Show progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min(prev + 5, 95);
          return newProgress;
        });
      }, 300);
      
      // Wait for all uploads to complete
      const newUrls = await Promise.all(uploadPromises);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update state
      setMediaUrls(prev => {
        const updatedUrls = [...prev, ...newUrls];
        onMediaUrlsChange(updatedUrls);
        return updatedUrls;
      });
      
      toast({
        title: "Media uploaded",
        description: `Successfully uploaded ${newUrls.length} ${newUrls.length === 1 ? 'file' : 'files'}`
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error("Media upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload media",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (onUploadProgress) onUploadProgress(false);
    }
  };
  
  const removeMedia = (index: number) => {
    setMediaUrls(prev => {
      const updatedUrls = prev.filter((_, i) => i !== index);
      onMediaUrlsChange(updatedUrls);
      return updatedUrls;
    });
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {mediaUrls.map((url, index) => (
            <div key={`media-${index}`} className="relative group rounded-md overflow-hidden h-24">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Handle image loading errors
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM2NjY2NjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEycHgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        className="w-full p-6 border-dashed"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-5 w-5 animate-spin mb-2" />
            <span>Uploading... {uploadProgress}%</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ImagePlus className="h-5 w-5 mb-2" />
            <span>Add Photos/Videos</span>
          </div>
        )}
      </Button>
    </div>
  );
};
