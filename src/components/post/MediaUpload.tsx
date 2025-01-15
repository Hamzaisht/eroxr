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

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
const MAX_VIDEO_DURATION = 300; // 5 minutes in seconds

export const MediaUpload = ({
  onFileSelect,
  isPayingCustomer,
  selectedFiles,
}: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = async (file: File) => {
    // Check file size first
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)} (current size: ${formatFileSize(file.size)})`);
    }

    if (file.type.startsWith('video/')) {
      const isValidVideo = await validateVideoFormat(file);
      if (!isValidVideo) {
        throw new Error("Invalid video format. Please upload MP4 or WebM files only.");
      }

      const duration = await getVideoDuration(file);
      if (duration > MAX_VIDEO_DURATION) {
        throw new Error(`Video must be shorter than ${MAX_VIDEO_DURATION / 60} minutes (current duration: ${Math.round(duration / 60)} minutes)`);
      }
    } else if (!file.type.startsWith('image/')) {
      throw new Error("File must be an image (JPG, PNG, GIF) or video (MP4, WebM)");
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
      // Validate each file before proceeding
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          await validateFile(file);
        } catch (error: any) {
          toast({
            title: `Invalid file: ${file.name}`,
            description: error.message,
            variant: "destructive",
          });
          e.target.value = '';
          setIsUploading(false);
          return;
        }
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
              <span className="text-xs text-muted-foreground">
                Max file size: {formatFileSize(MAX_FILE_SIZE)}
              </span>
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
          Supported formats: Images (JPG, PNG, GIF) and Videos (MP4, WebM) up to {formatFileSize(MAX_FILE_SIZE)}
        </p>
      </div>
    </div>
  );
};