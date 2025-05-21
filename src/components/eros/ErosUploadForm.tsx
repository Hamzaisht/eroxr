import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useToast } from '@/hooks/use-toast';

// We only need to fix the specific upload handling logic, so we'll just update what's needed
const ErosUploadForm = () => {
  const { uploadMedia, isUploading } = useMediaUpload();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  // Other component code and state would remain
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };
  
  const clearForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setFile(null);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };
  
  // Fix the upload handling function
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await uploadMedia(file, {
        contentCategory: "eros",
        maxSizeInMB: 100
      });
      
      if (result.success) {
        toast({
          title: "Upload successful",
          description: "Your file has been uploaded successfully"
        });
        // Handle successful upload
        clearForm();
        // Trigger any additional actions like navigation or refreshing a list
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload file",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload error",
        description: "An unexpected error occurred during upload",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6 p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">Upload New Content</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Enter description"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select category</option>
            <option value="photos">Photos</option>
            <option value="videos">Videos</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Media File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
            accept="image/*,video/*,audio/*"
          />
        </div>
        
        {previewUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Preview</label>
            <div className="border rounded-md p-2">
              {file?.type.startsWith('image/') ? (
                <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto" />
              ) : file?.type.startsWith('video/') ? (
                <video src={previewUrl} controls className="max-h-40 w-full" />
              ) : (
                <audio src={previewUrl} controls className="w-full" />
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={clearForm}
          className="flex-1"
          disabled={isUploading}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleUpload}
          className="flex-1"
          disabled={isUploading || !file}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
};

export default ErosUploadForm;
