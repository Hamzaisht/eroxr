
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus, VideoIcon, X, Loader2 } from "lucide-react";
import { useStoryUpload } from "./hooks/useStoryUpload";

export function StoryUploader() {
  const { 
    isUploading, 
    progress, 
    error, 
    previewUrl, 
    handleFileSelect, 
    uploadFile, 
    resetState 
  } = useStoryUpload();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // File input change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const isValid = await handleFileSelect(file);
    if (isValid) {
      setSelectedFile(file);
    }
  };

  // Clear the selected file
  const handleClear = () => {
    setSelectedFile(null);
    resetState();
  };

  // Upload the file
  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadFile(selectedFile);
    setSelectedFile(null);
  };

  return (
    <Card className="relative p-4 max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Create a Story</h3>
        <p className="text-sm text-muted-foreground">
          Share a photo or video that will last for 24 hours
        </p>
      </div>

      {previewUrl ? (
        <div className="relative aspect-[9/16] bg-black rounded-md overflow-hidden mb-4">
          {selectedFile?.type.startsWith('image/') ? (
            <img 
              src={previewUrl} 
              alt="Story preview" 
              className="w-full h-full object-contain"
            />
          ) : (
            <video 
              src={previewUrl} 
              className="w-full h-full object-contain" 
              controls
              autoPlay
              muted
              loop
            />
          )}
          
          {!isUploading && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex gap-4 justify-center mb-4">
          <label className="cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                <ImagePlus className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm mt-2">Photo</span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          
          <label className="cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                <VideoIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm mt-2">Video</span>
            </div>
            <input 
              type="file" 
              accept="video/*" 
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-destructive/10 text-destructive text-sm rounded">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm text-muted-foreground ml-auto">
              {progress}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {previewUrl && !isUploading && (
        <Button 
          className="w-full" 
          onClick={handleUpload}
        >
          Share to Story
        </Button>
      )}
    </Card>
  );
}
