import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';
import { useToast } from '@/hooks/use-toast';
import { MediaType, MediaAccessLevel } from '@/utils/media/types';

const NewStoryUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Fix the accept property to be compatible with react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
      'video/*': []
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        
        // Create preview URL
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  });

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const result = await uploadMediaToSupabase(
        file,
        'stories',
        {
          folder: 'stories',
          maxSizeMB: 50,
          accessLevel: MediaAccessLevel.PUBLIC
        }
      );

      if (result.success) {
        toast({
          title: "Story uploaded",
          description: "Your story has been successfully uploaded."
        });
        
        // Clear the form
        setFile(null);
        setPreview(null);
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "An error occurred while uploading your story.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
      console.error("Story upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };

  
  return (
    <div className="w-full max-w-md mx-auto p-4">
      {!file ? (
        <div 
          {...getRootProps()} 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Upload className="h-10 w-10 mb-2" />
            <p className="mb-1 font-medium">Drop your story file here or click to browse</p>
            <p className="text-xs text-gray-400">Images or videos up to 50MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            {file.type.includes('image') ? (
              <img src={preview!} alt="Preview" className="w-full rounded-lg" />
            ) : (
              <video src={preview!} className="w-full rounded-lg" controls />
            )}
            <Button 
              size="icon" 
              variant="destructive" 
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={handleUpload} 
            disabled={uploading} 
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Share Story</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewStoryUploader;
