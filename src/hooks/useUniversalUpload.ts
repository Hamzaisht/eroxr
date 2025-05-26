
import { useState } from 'react';
import { uploadMedia, uploadMultipleMedia, uploadWithProgress, UploadOptions } from '@/utils/upload/universalUpload';
import { useToast } from '@/hooks/use-toast';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  urls: string[];
  assetIds: string[];
}

export const useUniversalUpload = () => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    urls: [],
    assetIds: []
  });
  
  const { toast } = useToast();

  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      urls: [],
      assetIds: []
    });
  };

  const upload = async (
    file: File,
    options: UploadOptions = {}
  ) => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      error: null,
      progress: 0
    }));

    try {
      const result = await uploadWithProgress(
        file,
        options,
        (progress) => {
          setState(prev => ({ ...prev, progress }));
        }
      );

      if (result.success) {
        setState(prev => ({
          ...prev,
          isUploading: false,
          urls: [...prev.urls, result.url!],
          assetIds: [...prev.assetIds, result.assetId!],
          progress: 100
        }));

        toast({
          title: 'Upload successful',
          description: `${file.name} has been uploaded successfully`
        });
      } else {
        setState(prev => ({
          ...prev,
          isUploading: false,
          error: result.error || 'Upload failed',
          progress: 0
        }));

        toast({
          title: 'Upload failed',
          description: result.error || 'Failed to upload file',
          variant: 'destructive'
        });
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
        progress: 0
      }));

      toast({
        title: 'Upload error',
        description: errorMessage,
        variant: 'destructive'
      });

      return { success: false, error: errorMessage };
    }
  };

  const uploadMultiple = async (
    files: File[],
    options: UploadOptions = {}
  ) => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      error: null,
      progress: 0
    }));

    try {
      const results = await uploadMultipleMedia(files, options);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      setState(prev => ({
        ...prev,
        isUploading: false,
        urls: [...prev.urls, ...successful.map(r => r.url!)],
        assetIds: [...prev.assetIds, ...successful.map(r => r.assetId!)],
        progress: 100,
        error: failed.length > 0 ? `${failed.length} uploads failed` : null
      }));

      if (successful.length > 0) {
        toast({
          title: 'Upload completed',
          description: `${successful.length} file(s) uploaded successfully`
        });
      }

      if (failed.length > 0) {
        toast({
          title: 'Some uploads failed',
          description: `${failed.length} file(s) failed to upload`,
          variant: 'destructive'
        });
      }

      return results;
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
        progress: 0
      }));

      toast({
        title: 'Upload error',
        description: errorMessage,
        variant: 'destructive'
      });

      return [];
    }
  };

  return {
    ...state,
    upload,
    uploadMultiple,
    reset
  };
};
