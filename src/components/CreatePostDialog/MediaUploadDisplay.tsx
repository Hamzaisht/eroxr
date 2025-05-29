
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Image, Video, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useEffect, useState } from "react";

interface MediaUploadDisplayProps {
  selectedFiles: FileList | null;
  uploadError: string | null;
  uploadSuccess: boolean;
  uploadInProgress: boolean;
  uploadedAssetIds: string[];
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  onUploadStart: () => void;
}

export const MediaUploadDisplay = ({
  selectedFiles,
  uploadError,
  uploadSuccess,
  uploadInProgress,
  uploadedAssetIds,
  onUploadComplete,
  onUploadStart
}: MediaUploadDisplayProps) => {
  const [filePreviews, setFilePreviews] = useState<{[key: string]: string}>({});
  const { uploadMultiple } = useMediaUpload();

  useEffect(() => {
    // Create preview URLs for selected files
    if (selectedFiles) {
      const previews: {[key: string]: string} = {};
      Array.from(selectedFiles).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
          previews[`${file.name}-${index}`] = URL.createObjectURL(file);
        }
      });
      setFilePreviews(previews);

      // Auto-upload files when selected
      handleUpload();
    }

    // Cleanup preview URLs
    return () => {
      Object.values(filePreviews).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [selectedFiles]);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    console.log("📤 MediaUploadDisplay - Starting upload for", selectedFiles.length, "files");
    onUploadStart();

    try {
      const filesArray = Array.from(selectedFiles);
      const results = await uploadMultiple(filesArray, {
        contentCategory: 'posts',
        accessLevel: 'public',
        metadata: { 
          usage: 'post',
          upload_timestamp: new Date().toISOString(),
          upload_session: Date.now()
        }
      });

      console.log("📊 MediaUploadDisplay - Upload results:", results);

      const successfulUploads = results.filter(r => r.success && r.url && r.assetId);
      
      if (successfulUploads.length === 0) {
        throw new Error("All uploads failed");
      }
      
      const urls = successfulUploads.map(r => r.url!);
      const assetIds = successfulUploads.map(r => r.assetId!);
      
      console.log("✅ MediaUploadDisplay - Upload completed successfully:", {
        urls: urls.length,
        assetIds: assetIds.length
      });

      onUploadComplete(urls, assetIds);
      
    } catch (error) {
      console.error('💥 MediaUploadDisplay - Upload error:', error);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-500" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4 text-green-500" />;
    if (file.type.startsWith('audio/')) return <Mic className="w-4 h-4 text-purple-500" />;
    return <Image className="w-4 h-4 text-gray-500" />;
  };

  if (!selectedFiles || selectedFiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label>Selected Media Files ({selectedFiles.length})</Label>
      
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {uploadSuccess && !uploadInProgress && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <p className="text-sm text-green-700">
            ✓ {uploadedAssetIds.length} media file(s) uploaded successfully
          </p>
        </div>
      )}

      {uploadInProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">📤 Uploading media files...</p>
        </div>
      )}

      {/* File Previews */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from(selectedFiles).map((file, index) => {
          const previewKey = `${file.name}-${index}`;
          const preview = filePreviews[previewKey];
          
          return (
            <div key={index} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                {getFileIcon(file)}
                <span className="text-sm font-medium truncate">{file.name}</span>
              </div>
              
              {preview && (
                <div className="mb-2">
                  <img 
                    src={preview} 
                    alt={file.name}
                    className="w-full h-20 object-cover rounded"
                  />
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </div>
              
              {uploadSuccess && (
                <div className="text-xs text-green-600 mt-1">
                  ✓ Uploaded
                </div>
              )}
              
              {uploadInProgress && (
                <div className="text-xs text-blue-600 mt-1">
                  📤 Uploading...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
