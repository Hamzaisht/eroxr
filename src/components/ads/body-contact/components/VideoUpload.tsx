
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

interface VideoUploadProps {
  videoFile: File | null;
  onUpdateVideoFile: (file: File | null) => void;
}

export const VideoUpload = ({ videoFile, onUpdateVideoFile }: VideoUploadProps) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (file) {
      setIsUploading(true);
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setUploadError("File too large. Maximum size is 50MB.");
        setIsUploading(false);
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        setUploadError("Please upload a valid video file.");
        setIsUploading(false);
        return;
      }
      
      console.log("Video selected:", file.name, `${(file.size / (1024 * 1024)).toFixed(2)}MB`, file.type);
      onUpdateVideoFile(file);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Video Profile <span className="text-red-500">*</span></Label>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="hidden"
          id="video-upload"
          disabled={isUploading}
        />
        <Label
          htmlFor="video-upload"
          className={`flex items-center gap-2 cursor-pointer ${
            isUploading 
              ? "bg-gray-300 text-gray-500" 
              : "bg-primary/10 hover:bg-primary/20 text-primary"
          } px-4 py-2 rounded-md`}
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : videoFile ? 'Change Video' : 'Upload Video'}
        </Label>
        {videoFile && !isUploading && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
            <span className="truncate max-w-[200px]">{videoFile.name}</span>
            <span className="ml-2 text-xs">
              ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
        )}
        {isUploading && (
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="animate-pulse">Processing video...</span>
          </div>
        )}
      </div>
      {uploadError && (
        <div className="flex items-center text-sm text-red-500 mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          {uploadError}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        <span className="text-red-500">Required.</span> Maximum size: 50MB. Recommended length: 30-60 seconds.
      </p>
    </div>
  );
};
