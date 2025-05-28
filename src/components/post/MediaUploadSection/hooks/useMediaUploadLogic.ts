
import { useState } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { MediaAccessLevel } from '@/utils/media/types';

interface UseMediaUploadLogicProps {
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  onUploadStart?: () => void;
  defaultAccessLevel: MediaAccessLevel;
}

export const useMediaUploadLogic = ({
  onUploadComplete,
  onUploadStart,
  defaultAccessLevel
}: UseMediaUploadLogicProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { uploadMedia } = useMediaUpload();

  const handleFileSelect = (files: File[]) => {
    console.log("MediaUploadSection - Files selected:", files.length, files.map(f => f.name));
    setSelectedFiles(prev => [...prev, ...files]);
    setUploadError(null);
    setUploadSuccess(false);
    
    if (files.length > 0) {
      setTimeout(() => handleUpload([...selectedFiles, ...files]), 100);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async (filesToUpload?: File[]) => {
    const files = filesToUpload || selectedFiles;
    
    if (files.length === 0) {
      console.log("MediaUploadSection - No files to upload");
      setUploadError("Please select files to upload");
      return;
    }

    console.log("MediaUploadSection - Starting upload for", files.length, "files");
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);
    
    onUploadStart?.();

    try {
      const uploadResults: Array<{ success: boolean; url?: string; assetId?: string; error?: string }> = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`MediaUploadSection - Uploading file ${i + 1}/${files.length}:`, file.name);
        setUploadProgress(((i + 1) / files.length) * 100);
        
        if (!file || file.size === 0) {
          throw new Error(`Invalid file: ${file?.name || 'Unknown'}`);
        }

        if (file.size > 100 * 1024 * 1024) {
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
        uploadResults.push(result);
        
        if (!result.success) {
          throw new Error(`Upload failed for ${file.name}: ${result.error || 'Unknown error'}`);
        }

        if (!result.assetId) {
          throw new Error(`No asset ID returned for ${file.name}`);
        }
      }

      const successfulUploads = uploadResults.filter(r => r.success && r.assetId);
      
      if (successfulUploads.length === 0) {
        throw new Error("All uploads failed");
      }
      
      const urls = successfulUploads.map(r => r.url!);
      const assetIds = successfulUploads.map(r => r.assetId!);
      
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

  return {
    selectedFiles,
    isUploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    handleFileSelect,
    removeFile,
    handleUpload
  };
};
