import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, FileVideo, Loader2 } from 'lucide-react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { isImageFile, isVideoFile } from '@/utils/upload/validators';

interface MediaUploaderProps {
  context: 'post' | 'story' | 'message' | 'profile' | 'short';
  onComplete: (url: string) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  context,
  onComplete,
  onError,
  accept = 'image/*,video/*',
  maxSizeMB = 50
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const { toast } = useToast();
  
  const { uploadMedia, uploadState, validateFile } = useMediaUpload({
    contentCategory: context,
    maxSizeInMB: maxSizeMB,
    allowedTypes: accept.split(',')
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.message || "File not supported",
        variant: "destructive"
      });
      if (onError) onError(validation.message || "Invalid file");
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview
    try {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } catch (error) {
      console.error("Failed to create preview", error);
    }
    
    // Auto upload
    handleUpload(file);
  };
  
  const handleUpload = async (file: File) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "You need to be signed in to upload media",
        variant: "destructive"
      });
      if (onError) onError("Authentication required");
      return;
    }
    
    try {
      const result = await uploadMedia(file, { contentCategory: context });
      
      if (result.success && result.url) {
        onComplete(result.url);
      } else {
        if (onError) onError(result.error || "Upload failed");
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload media",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      if (onError) onError(error.message || "Upload failed");
      toast({
        title: "Upload error",
        description: error.message || "An error occurred during upload",
        variant: "destructive"
      });
    }
  };
  
  const renderPreview = () => {
    if (!selectedFile || !preview) return null;
    
    if (isImageFile(selectedFile)) {
      return <img src={preview} alt="Preview" className="w-full h-auto max-h-48 object-contain" />;
    } else if (isVideoFile(selectedFile)) {
      return <video src={preview} className="w-full h-auto max-h-48 object-contain" controls />;
    }
    
    return null;
  };
  
  const resetSelection = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="border rounded-md p-2 bg-black/5">
          {renderPreview()}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploadState.isUploading}
      />
      
      {!selectedFile ? (
        <Button
          type="button"
          variant="outline"
          className="w-full h-20 flex flex-col gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadState.isUploading}
        >
          <Upload className="h-5 w-5" />
          <span>Select Media to Upload</span>
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {isImageFile(selectedFile) ? (
              <FileImage className="h-4 w-4" />
            ) : (
              <FileVideo className="h-4 w-4" />
            )}
            <span className="flex-1 truncate">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              {Math.round(selectedFile.size / 1024)}KB
            </span>
          </div>
          
          {uploadState.isUploading && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{Math.round(uploadState.progress)}%</span>
            </div>
          )}
        </div>
      )}
      
      {uploadState.error && (
        <p className="text-destructive text-sm">{uploadState.error}</p>
      )}
    </div>
  );
};
