
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Video, Mic, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { MediaAccessLevel } from '@/utils/media/types';
import { Progress } from '@/components/ui/progress';

interface MediaUploadSectionProps {
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  onUploadStart?: () => void;
  defaultAccessLevel?: MediaAccessLevel;
}

export const MediaUploadSection = ({
  onUploadComplete,
  onUploadStart,
  defaultAccessLevel = MediaAccessLevel.PUBLIC
}: MediaUploadSectionProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadMedia, uploadState } = useMediaUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("MediaUploadSection - Files selected:", files.length, files);
    setSelectedFiles(prev => [...prev, ...files]);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      console.log("MediaUploadSection - No files to upload");
      setUploadError("Please select files to upload");
      return;
    }

    console.log("MediaUploadSection - Starting upload for", selectedFiles.length, "files");
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);
    
    // Notify parent that upload has started
    onUploadStart?.();

    try {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        console.log(`MediaUploadSection - Uploading file ${index + 1}/${selectedFiles.length}:`, file.name);
        setUploadProgress(((index + 1) / selectedFiles.length) * 100);
        
        // Validate file before upload
        if (!file || file.size === 0) {
          throw new Error(`Invalid file: ${file?.name || 'Unknown'}`);
        }

        if (file.size > 100 * 1024 * 1024) { // 100MB limit
          throw new Error(`File too large: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)`);
        }
        
        const result = await uploadMedia(file, {
          contentCategory: 'post',
          accessLevel: defaultAccessLevel,
          metadata: { 
            usage: 'post',
            upload_timestamp: new Date().toISOString(),
            upload_session: Date.now(),
            original_filename: file.name,
            file_size: file.size,
            mime_type: file.type
          }
        });
        
        console.log(`MediaUploadSection - Upload result for ${file.name}:`, result);
        
        if (!result.success) {
          throw new Error(`Upload failed for ${file.name}: ${result.error || 'Unknown error'}`);
        }

        if (!result.assetId) {
          throw new Error(`No asset ID returned for ${file.name}`);
        }
        
        return result;
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(r => r.success && r.assetId);
      
      console.log("MediaUploadSection - Upload results:", {
        total: results.length,
        successful: successfulUploads.length,
        failed: results.length - successfulUploads.length
      });
      
      if (successfulUploads.length === 0) {
        throw new Error("All uploads failed");
      }

      if (successfulUploads.length < results.length) {
        console.warn(`MediaUploadSection - Some uploads failed: ${successfulUploads.length}/${results.length} successful`);
      }
      
      const urls = successfulUploads.map(r => r.url!);
      const assetIds = successfulUploads.map(r => r.assetId!);
      
      // Validate asset IDs are proper UUIDs
      const validAssetIds = assetIds.filter(id => {
        const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (!isValid) {
          console.error("MediaUploadSection - Invalid asset ID:", id);
        }
        return isValid;
      });

      if (validAssetIds.length !== assetIds.length) {
        throw new Error("Some uploads returned invalid asset IDs");
      }
      
      console.log("MediaUploadSection - Calling onUploadComplete with:", {
        urls: urls.length,
        assetIds: validAssetIds.length,
        actualAssetIds: validAssetIds
      });
      
      onUploadComplete(urls, validAssetIds);
      setSelectedFiles([]);
      setUploadSuccess(true);
      setUploadProgress(100);
      
    } catch (error) {
      console.error('MediaUploadSection - Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.startsWith('audio/')) return <Mic className="w-4 h-4" />;
    return <Upload className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Add More Media
        </Button>
        
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Success Display */}
      {uploadSuccess && !isUploading && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700">All files uploaded successfully!</p>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected files ({selectedFiles.length})</p>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-luxury-neutral/5 rounded">
              <div className="flex items-center gap-2">
                {getFileIcon(file)}
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-luxury-neutral/60">
                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {(isUploading || uploadProgress > 0) && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-luxury-neutral/60 text-center">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
          
          <Button 
            type="button"
            onClick={handleUpload}
            disabled={isUploading || uploadSuccess}
            className="w-full"
            size="sm"
          >
            {isUploading ? 'Uploading...' : uploadSuccess ? 'Uploaded ✓' : `Upload ${selectedFiles.length} file(s)`}
          </Button>
        </div>
      )}
    </div>
  );
};
