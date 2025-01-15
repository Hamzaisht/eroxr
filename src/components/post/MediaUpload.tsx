import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateVideoFormat, getVideoDuration } from "@/utils/videoProcessing";
import { supabase } from "@/integrations/supabase/client";

interface MediaUploadProps {
  onFileSelect: (files: FileList | null) => void;
  isPayingCustomer: boolean | null;
  selectedFiles: FileList | null;
}

export const MediaUpload = ({
  onFileSelect,
  isPayingCustomer,
  selectedFiles,
}: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const validateFile = async (file: File) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 50MB");
    }

    if (file.type.startsWith('video/')) {
      const isValidVideo = await validateVideoFormat(file);
      if (!isValidVideo) {
        throw new Error("Invalid video format");
      }

      const duration = await getVideoDuration(file);
      if (duration > 300) { // 5 minutes
        throw new Error("Video must be shorter than 5 minutes");
      }
    } else if (!file.type.startsWith('image/')) {
      throw new Error("File must be an image or video");
    }

    return true;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPayingCustomer) {
      toast({
        title: "Premium Feature",
        description: "Only paying customers can upload media",
        variant: "destructive",
      });
      return;
    }

    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate each file
      for (let i = 0; i < files.length; i++) {
        await validateFile(files[i]);
      }

      // Test storage access
      const { data: bucketExists, error: bucketError } = await supabase
        .storage
        .getBucket('posts');

      if (bucketError) {
        throw new Error("Unable to access storage. Please check your permissions.");
      }

      onFileSelect(files);
      toast({
        title: "Files selected",
        description: `${files.length} file(s) ready for upload`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process files",
        variant: "destructive",
      });
      onFileSelect(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Media</Label>
        {selectedFiles && (
          <span className="text-sm text-muted-foreground">
            {selectedFiles.length} file(s) selected
          </span>
        )}
      </div>

      <div className="grid gap-4">
        <input
          type="file"
          id="media-upload"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading || !isPayingCustomer}
        />

        <Button
          type="button"
          variant="outline"
          className="w-full h-24 relative"
          onClick={() => document.getElementById('media-upload')?.click()}
          disabled={isUploading || !isPayingCustomer}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImagePlus className="h-6 w-6" />
              <span>Upload Media</span>
            </div>
          )}
        </Button>

        {!isPayingCustomer && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Upgrade to upload media files</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Supported formats: Images (JPG, PNG, GIF) and Videos (MP4, WebM) up to 50MB
        </p>
      </div>
    </div>
  );
};