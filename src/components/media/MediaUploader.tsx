
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNewMediaUpload } from "@/hooks/useNewMediaUpload";

interface MediaUploaderProps {
  context: "post" | "story" | "message" | "short" | "profile" | "avatar";
  onComplete: (url: string) => void;
  acceptTypes?: string;
  buttonText?: string;
  maxSizeMB?: number;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  context,
  onComplete,
  acceptTypes = "image/*,video/*",
  buttonText = "Upload Media",
  maxSizeMB = 100
}) => {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { uploadMedia, state } = useNewMediaUpload();
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return;
    }
    
    // Create preview
    setIsPreviewLoading(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload to storage
      const result = await uploadMedia(file, {
        bucket: context,
        onSuccess: (url) => {
          onComplete(url);
        }
      });
      
      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error: any) {
      toast({
        title: "Upload error",
        description: error.message || "Failed to upload media",
        variant: "destructive"
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };
  
  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={acceptTypes}
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        disabled={state.isUploading}
      />
      
      {previewUrl && (
        <div className="relative mb-4">
          {state.isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md z-10">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <p className="text-white mt-2">{state.progress}%</p>
            </div>
          )}
          
          {state.error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md z-10">
              <p className="text-red-400">{state.error}</p>
              <Button variant="destructive" onClick={clearPreview} className="mt-2">
                Try Again
              </Button>
            </div>
          )}
          
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-20"
            onClick={clearPreview}
            disabled={state.isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {previewUrl.endsWith(".mp4") || previewUrl.endsWith(".webm") || previewUrl.endsWith(".mov") ? (
            <video
              src={previewUrl}
              className="w-full h-48 object-contain bg-black rounded-md"
              controls
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-contain bg-black rounded-md"
            />
          )}
        </div>
      )}
      
      {!previewUrl && (
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={state.isUploading}
        >
          {state.isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {buttonText}
        </Button>
      )}
    </div>
  );
};
