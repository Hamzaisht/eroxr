
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { runFileDiagnostic } from "@/utils/upload/fileUtils";
import { createUniqueFilePath } from "@/utils/upload/fileUtils";
import { uploadFileToStorage } from "@/utils/upload/storageService";
import { useSession } from "@supabase/auth-helpers-react";

interface MediaUploadProps {
  onFileSelect: (files: FileList | null) => void;
  isPayingCustomer: boolean | null;
  selectedFiles: FileList | null;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export const MediaUpload = ({
  onFileSelect,
  isPayingCustomer,
  selectedFiles,
}: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const session = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPayingCustomer) {
      toast({
        title: "Premium Feature",
        description: "Only paying customers can upload media",
        variant: "destructive",
      });
      return;
    }
    
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload media",
        variant: "destructive",
      });
      return;
    }

    const files = e.target.files;
    if (!files?.length) return;

    // CRITICAL: Use direct file reference
    const fileArray = Array.from(files);
    
    // Perform file validation
    for (const file of fileArray) {
      runFileDiagnostic(file);
      
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${formatFileSize(MAX_FILE_SIZE)}`,
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Create a data transfer object to build a new FileList
      const dataTransfer = new DataTransfer();
      
      // Process each file and add to the DataTransfer
      for (const file of fileArray) {
        dataTransfer.items.add(file);
        setUploadProgress(prev => prev + Math.round(70 / fileArray.length));
      }
      
      // Pass the files to the parent component
      onFileSelect(dataTransfer.files);
      setUploadProgress(100);
      
      toast({
        title: "Files selected",
        description: `${fileArray.length} file(s) selected for upload`,
      });
    } catch (error: any) {
      console.error("Error processing files:", error);
      
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

  const handleButtonClick = () => {
    if (!isPayingCustomer) {
      toast({
        title: "Premium Feature",
        description: "Only paying customers can upload media",
        variant: "destructive",
      });
      return;
    }
    
    fileInputRef.current?.click();
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
          ref={fileInputRef}
          id="media-upload"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading || !isPayingCustomer}
        />

        <Button
          type="button"
          variant="outline"
          className="w-full h-24 relative"
          onClick={handleButtonClick}
          disabled={isUploading || !isPayingCustomer}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Processing... {uploadProgress}%</span>
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
