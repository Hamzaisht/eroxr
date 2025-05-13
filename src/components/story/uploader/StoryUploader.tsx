
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaUploader } from '@/components/shared/MediaUploader';
import { VideoPreview } from '../VideoPreview';

interface StoryUploaderProps {
  onUploadComplete?: (url: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const StoryUploader = ({ 
  onUploadComplete, 
  onCancel,
  className 
}: StoryUploaderProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  
  // File input reference to trigger file selection
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setIsUploading(true);
    
    // Create Object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    
    // Simulate upload progress (this would be replaced with actual upload logic)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        // In a real implementation, this would be the URL returned from the server
        if (onUploadComplete) {
          onUploadComplete(objectUrl);
        }
        
        toast({
          title: "Upload successful",
          description: "Your story has been uploaded.",
        });
      }
    }, 300);
  };
  
  const handleError = (error: string) => {
    toast({
      title: "Upload failed",
      description: error,
      variant: "destructive",
    });
  };
  
  const handleCancel = () => {
    setVideoUrl(null);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-1">Upload Story</h3>
            <p className="text-sm text-muted-foreground">
              Upload a video for your story (up to 60 seconds)
            </p>
          </div>
          
          {videoUrl ? (
            <div className="relative aspect-[9/16] rounded-lg overflow-hidden">
              <VideoPreview videoUrl={videoUrl} className="w-full h-full" />
              
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm font-medium">{uploadProgress}%</p>
                </div>
              )}
              
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleCancel}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <MediaUploader
              onComplete={url => setVideoUrl(url)}
              onError={handleError}
              mediaTypes="video"
              maxSizeInMB={50}
              context="stories"
              buttonText="Upload Video"
              showPreview={true}
              autoUpload={true}
            />
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 border-t p-4">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          disabled={isUploading}
        >
          Cancel
        </Button>
        
        <Button
          disabled={!videoUrl || isUploading}
          onClick={() => onUploadComplete && videoUrl && onUploadComplete(videoUrl)}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing...
            </>
          ) : (
            'Add to Story'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
