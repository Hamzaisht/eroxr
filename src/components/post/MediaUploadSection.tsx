import { ImagePlus, Video, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface MediaUploadSectionProps {
  selectedFiles: FileList | null;
  onFileSelect: (files: FileList | null) => void;
  isPayingCustomer: boolean | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MediaUploadSection = ({
  selectedFiles,
  onFileSelect,
  isPayingCustomer,
  handleFileSelect
}: MediaUploadSectionProps) => {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyStorageAccess = async () => {
    try {
      setIsVerifying(true);
      // Verify storage bucket access
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('posts');

      if (bucketError) {
        console.error('Storage bucket verification failed:', bucketError);
        toast({
          title: "Storage Access Error",
          description: "Unable to access storage. Please try again later.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Storage verification error:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const validateVideoFile = async (file: File): Promise<boolean> => {
    if (file.type.startsWith('video/')) {
      // Check file size (50MB = 50 * 1024 * 1024 bytes)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Videos must be 50MB or smaller",
          variant: "destructive",
        });
        return false;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';

      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;
          if (duration > 300) { // 5 minutes = 300 seconds
            toast({
              title: "Video too long",
              description: "Videos must be 5 minutes or shorter",
              variant: "destructive",
            });
            resolve(false);
          }
          resolve(true);
        };
        video.src = URL.createObjectURL(file);
      });
    }
    return true;
  };

  const handleFileValidation = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Verify storage access first
    const hasStorageAccess = await verifyStorageAccess();
    if (!hasStorageAccess) {
      e.target.value = '';
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isValid = await validateVideoFile(file);
      if (!isValid) {
        e.target.value = '';
        return;
      }
    }

    handleFileSelect(e);
  };

  const handleButtonClick = () => {
    if (!isPayingCustomer) {
      toast({
        title: "Premium Feature",
        description: "Only paying customers can upload media",
        variant: "destructive",
      });
      return;
    }
    
    const input = document.getElementById('post-file-upload') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <div className="space-y-2">
      <Label>Media</Label>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="w-full"
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <AlertCircle className="h-4 w-4 mr-2 animate-pulse" />
              Verifying...
            </>
          ) : (
            <>
              <Video className="h-4 w-4 mr-2" />
              {selectedFiles?.length ? `${selectedFiles.length} file(s) selected` : 'Upload Video'}
            </>
          )}
        </Button>
        <input
          type="file"
          id="post-file-upload"
          accept="video/*"
          onChange={handleFileValidation}
          disabled={!isPayingCustomer || isVerifying}
          style={{ display: 'none' }}
          onClick={(e) => {
            // Reset the value to allow selecting the same file again
            (e.target as HTMLInputElement).value = '';
          }}
        />
      </div>
      {!isPayingCustomer && (
        <p className="text-sm text-muted-foreground">
          Upgrade to upload video files
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Supported formats: MP4, WebM up to 50MB and 5 minutes
      </p>
    </div>
  );
};