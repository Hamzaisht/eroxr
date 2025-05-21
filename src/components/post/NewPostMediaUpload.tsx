
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useToast } from "@/hooks/use-toast";

interface NewPostMediaUploadProps {
  onMediaUrlsChange: (urls: string[]) => void;
}

export const NewPostMediaUpload: React.FC<NewPostMediaUploadProps> = ({ 
  onMediaUrlsChange 
}) => {
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const { upload, uploadState } = useMediaUpload();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      // Determine media type
      const mediaType = selectedFile.type.startsWith('image/') 
        ? 'image' 
        : selectedFile.type.startsWith('video/') 
          ? 'video' 
          : selectedFile.type.startsWith('audio/')
            ? 'audio'
            : 'document';
      
      // Upload using our centralized upload hook
      const url = await upload({ 
        file: selectedFile, 
        mediaType,
        contentCategory: 'posts'
      });
      
      if (!url) {
        throw new Error("Failed to upload media");
      }
      
      const newMediaUrls = [...mediaUrls, url];
      setMediaUrls(newMediaUrls);
      onMediaUrlsChange(newMediaUrls);
      setShowUploader(false);
      setSelectedFile(null);
      
      toast({
        title: "Upload successful",
        description: `${mediaType} uploaded successfully`
      });
      
    } catch (error: any) {
      console.error("Media upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload media",
        variant: "destructive"
      });
    }
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    const newMediaUrls = mediaUrls.filter((_, index) => index !== indexToRemove);
    setMediaUrls(newMediaUrls);
    onMediaUrlsChange(newMediaUrls);
  };

  return (
    <div className="space-y-4">
      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediaUrls.map((url, index) => (
            <div key={index} className="relative group">
              <UniversalMedia
                item={url}
                className="w-full h-48 rounded-md overflow-hidden"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveMedia(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {showUploader ? (
        <div className="border rounded-md p-4">
          <div className="space-y-4">
            <Input
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleMediaSelect}
            />
            
            {selectedFile && (
              <div className="text-sm">
                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowUploader(false);
                  setSelectedFile(null);
                }}
                disabled={uploadState.isUploading}
              >
                Cancel
              </Button>
              
              <Button
                variant="default"
                onClick={handleUpload}
                disabled={!selectedFile || uploadState.isUploading}
              >
                {uploadState.isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadState.progress}%
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowUploader(true)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Add Media
        </Button>
      )}
    </div>
  );
};
