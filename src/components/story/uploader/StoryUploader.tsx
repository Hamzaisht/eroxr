
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toDbValue } from "@/utils/supabase/helpers";
import { Camera, X } from "lucide-react";

export const StoryUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
      'video/*': []
    },
    maxSize: 10485760, // 10MB max
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        
        // Create preview
        const fileUrl = URL.createObjectURL(file);
        setPreview(fileUrl);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]?.message || "File rejected";
      toast({
        title: "File upload failed",
        description: error,
        variant: "destructive"
      });
    }
  });

  const uploadStory = async () => {
    if (!file || !session?.user?.id) {
      toast({
        title: "Upload error",
        description: "Please select a file and ensure you're logged in",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `stories/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
        
      const publicUrl = publicUrlData.publicUrl;
      
      // 3. Determine media type
      const isVideo = file.type.startsWith('video/');
      
      // 4. Create database entry
      const storyData = {
        creator_id: session.user.id,
        media_url: isVideo ? null : publicUrl,
        video_url: isVideo ? publicUrl : null,
        is_active: true,
        content_type: isVideo ? 'video' : 'image',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      };
      
      const { error: dbError } = await supabase
        .from('stories')
        .insert(toDbValue(storyData));
        
      if (dbError) throw dbError;
      
      // Success
      toast({
        title: "Story uploaded",
        description: "Your story has been shared successfully!"
      });
      
      // Reset state
      setFile(null);
      setPreview(null);
    } catch (error: any) {
      console.error("Story upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const cancelUpload = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`relative cursor-pointer transition-all duration-300 ${
            isDragActive ? 'bg-luxury-primary/20' : 'bg-luxury-primary/10'
          } rounded-full p-1 aspect-square flex items-center justify-center`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            <Camera className="w-5 h-5 text-luxury-primary" />
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative aspect-square rounded-full overflow-hidden border-2 border-luxury-primary">
            {file.type.startsWith('video/') ? (
              <video 
                src={preview || ''} 
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
              />
            ) : (
              <img 
                src={preview || ''} 
                alt="Story preview" 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
          
          <div className="absolute -top-2 -right-2">
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={cancelUpload}
              type="button"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="mt-2 flex justify-center">
            <Button
              size="sm"
              onClick={uploadStory}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Share"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
