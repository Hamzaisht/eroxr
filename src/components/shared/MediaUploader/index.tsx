
import { useState, useEffect, useRef } from "react";
import { FileUploadButton } from "./FileUploadButton";
import { MediaPreview } from "./MediaPreview";
import { UploadProgress } from "./UploadProgress";
import { getAllowedTypes, validateFile } from "./utils";
import { toast } from "@/components/ui/use-toast";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { MediaTypes, MediaUploaderProps } from "./types";

export const MediaUploader = ({
  onComplete,
  onError,
  context = "media",
  maxSizeInMB = 50,
  mediaTypes = "both",
  buttonText = "Upload Media",
  buttonVariant = "default",
  className = "",
  showPreview = false,
  autoUpload = false,
  onFileCapture
}: MediaUploaderProps) => {
  // File selection and preview state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [selectedFileInfo, setSelectedFileInfo] = useState<{
    name: string;
    type: string;
    size: number;
  } | null>(null);
  
  // Use our media upload hook
  const {
    uploadState,
    uploadMedia,
    resetUploadState,
  } = useMediaUpload({
    // We'll handle these properties properly in the hook
    bucket: context === 'avatar' ? 'avatars' : 'media', 
    maxSizeInMB,
  });
  
  // Clear preview when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  // Process file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate the file format and size
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      setPreviewError(fileValidation.error || "Invalid file");
      if (onError && fileValidation.error) {
        onError(fileValidation.error);
      }
      return;
    }
    
    // Store file metadata
    setSelectedFile(file);
    setSelectedFileInfo({
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Generate preview for images and videos
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewUrl(null);
    
    try {
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // If callback provided, pass the file
      if (onFileCapture) {
        onFileCapture(file);
      }
      
      // Auto upload if enabled
      if (autoUpload) {
        handleUpload();
      }
    } catch (err: any) {
      console.error("Preview generation error:", err);
      setPreviewError("Failed to generate preview");
      if (onError) {
        onError("Failed to generate preview: " + err.message);
      }
    } finally {
      setPreviewLoading(false);
    }
  };
  
  // Clear selection
  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setSelectedFile(null);
    setPreviewUrl(null);
    setPreviewError(null);
    setSelectedFileInfo(null);
    resetUploadState();
  };
  
  // Upload the file to storage
  const handleUpload = async () => {
    if (!selectedFile) {
      setPreviewError("No file selected");
      return;
    }
    
    try {
      const result = await uploadMedia(selectedFile, {
        bucket: context === 'avatar' ? 'avatars' : 'media',
        maxSizeInMB
      });
      
      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }
      
      if (result.url) {
        onComplete(result.url);
        
        toast({
          title: "Upload successful",
          description: "Your file has been uploaded."
        });
        
        // Auto clear the selection after successful upload
        if (autoUpload) {
          handleClear();
        }
      } else {
        throw new Error("Upload succeeded but no URL was returned");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      if (onError) {
        onError(error.message);
      }
      
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const allowedTypes = getAllowedTypes(mediaTypes);
  
  return (
    <div className={className}>
      {/* Preview area */}
      {showPreview && selectedFile && (
        <MediaPreview
          file={selectedFile}
          previewUrl={previewUrl}
          previewError={previewError}
          previewLoading={previewLoading}
          selectedFileInfo={selectedFileInfo}
          onClear={handleClear}
          isUploading={uploadState.isUploading}
        />
      )}
      
      {/* File selection button */}
      {(!selectedFile || !showPreview) && (
        <FileUploadButton
          onFileSelect={handleFileSelect}
          allowedTypes={allowedTypes}
          buttonText={buttonText}
          buttonVariant={buttonVariant}
          isUploading={uploadState.isUploading}
        />
      )}
      
      {/* Upload progress */}
      <UploadProgress
        progress={uploadState.progress}
        isUploading={uploadState.isUploading}
      />
      
      {/* Upload button for manual upload mode */}
      {selectedFile && !autoUpload && !uploadState.isUploading && !uploadState.isComplete && (
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-primary text-white rounded w-full hover:bg-primary/90"
          onClick={handleUpload}
        >
          Upload
        </button>
      )}
    </div>
  );
};
