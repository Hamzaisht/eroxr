
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Camera, Upload } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { runFileDiagnostic } from '@/utils/upload/fileUtils';
import { MediaUploader } from "@/components/shared/MediaUploader";

export const StoryUploader = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null); // CRITICAL: Use ref for file storage instead of state
  const session = useSession();
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // CRITICAL: Get file directly from input event, not from state
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;
    
    // CRITICAL: Run comprehensive file diagnostic
    runFileDiagnostic(file);
    
    // CRITICAL: Store in ref, not in state
    fileRef.current = file;
    
    // Create and set preview URL
    setPreviewUrl(URL.createObjectURL(file));
    
    // Automatically upload the file
    handleUploadFile(file);
  };
  
  const handleUploadFile = async (file: File) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to upload stories",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // CRITICAL: Run diagnostic again right before upload
      runFileDiagnostic(file);
      
      // Generate a unique file path
      const userId = session.user.id;
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${timestamp}_story.${fileExt}`;
      
      // Upload to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('stories')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(filePath);
      
      // Create story record in database
      const contentType = file.type.startsWith('image/') ? 'image' : 'video';
      
      const { error: storyError } = await supabase
        .from('stories')
        .insert({
          creator_id: session.user.id,
          media_url: publicUrl,
          content_type: contentType,
          is_public: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
      
      if (storyError) {
        throw storyError;
      }
      
      toast({
        title: "Story uploaded",
        description: "Your story has been uploaded successfully"
      });
      
      // Reset the form
      resetForm();
      
    } catch (error: any) {
      console.error('Story upload error:', error);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    // Revoke any object URLs to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    fileRef.current = null;
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleStoryUploaded = (url: string) => {
    if (!session?.user?.id) return;
    
    // Create story record in database
    supabase
      .from('stories')
      .insert({
        creator_id: session.user.id,
        media_url: url,
        content_type: url.toLowerCase().includes('.mp4') ? 'video' : 'image',
        is_public: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      .then(({ error }) => {
        if (error) {
          throw error;
        }
        
        toast({
          title: "Story uploaded",
          description: "Your story has been uploaded successfully"
        });
        
        setShowUploader(false);
      })
      .catch((error) => {
        console.error('Error creating story record:', error);
        
        toast({
          title: "Upload failed",
          description: "Failed to create story. Please try again.",
          variant: "destructive"
        });
      });
  };
  
  const handleUploadError = (message: string) => {
    toast({
      title: "Upload failed",
      description: message,
      variant: "destructive",
    });
  };

  // If using the shared component, render MediaUploader
  if (showUploader) {
    return (
      <Card className="p-4 w-full max-w-sm mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Add to Story</h3>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUploader(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <MediaUploader
            context="story"
            mediaTypes="both"
            buttonText="Select Media for Story"
            onComplete={handleStoryUploaded}
            onError={handleUploadError}
            maxSizeInMB={100}
            autoUpload
          />
        </div>
      </Card>
    );
  }

  // If not using the shared component, render the original one
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
              className="absolute top-1 right-1 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full"
              onClick={resetForm}
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
              onClick={() => setShowUploader(true)}
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
      </div>
    </Card>
  );
};
