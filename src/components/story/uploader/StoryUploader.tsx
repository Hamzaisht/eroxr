
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, X } from "lucide-react";
import { useStoryUpload } from './hooks/useStoryUpload';

export const StoryUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isUploading,
    progress,
    error,
    previewUrl,
    handleFileSelect,
    uploadFile,
    resetState
  } = useStoryUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // CRITICAL: Enhanced validation before proceeding
    if (!file) {
      console.error("No file selected");
      return;
    }
    
    if (!(file instanceof File)) {
      console.error("Invalid file object:", file);
      return;
    }
    
    if (file.size === 0) {
      console.error("File has zero size:", file.name);
      return;
    }
    
    // Use the hook's validation and selection
    const success = await handleFileSelect(file);
    if (success) {
      await uploadFile(file);
    }
  };

  return (
    <Card className="p-4 w-full max-w-sm mx-auto">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Add to Story</h3>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        {previewUrl ? (
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1 right-1 rounded-full bg-black/40 hover:bg-black/60 text-white"
              onClick={resetState}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {previewUrl.includes('video') ? (
              <video 
                src={previewUrl} 
                className="w-full rounded-md aspect-[9/16] object-cover" 
                autoPlay 
                muted 
                loop 
              />
            ) : (
              <img 
                src={previewUrl} 
                alt="Story preview" 
                className="w-full rounded-md aspect-[9/16] object-cover" 
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-1"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Camera className="h-6 w-6" />
              <span className="text-xs">Media</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-1"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-6 w-6" />
              <span className="text-xs">Upload</span>
            </Button>
          </div>
        )}
        
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        {error && (
          <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
};
