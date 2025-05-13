
import { useState, useEffect } from 'react';
import { createFilePreview, revokeFilePreview } from '@/utils/upload/fileUtils';

export const useFilePreview = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'other' | null>(null);

  // Create a preview URL from a file
  const createPreview = (file: File | null) => {
    // Clean up any existing preview URL
    if (previewUrl) {
      revokeFilePreview(previewUrl);
      setPreviewUrl(null);
    }

    if (!file) {
      setFileType(null);
      return;
    }

    // Determine file type
    if (file.type.startsWith('image/')) {
      setFileType('image');
    } else if (file.type.startsWith('video/')) {
      setFileType('video');
    } else {
      setFileType('other');
    }

    // Create a new preview URL
    const newPreviewUrl = createFilePreview(file);
    setPreviewUrl(newPreviewUrl);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeFilePreview(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    previewUrl,
    fileType,
    createPreview,
    revokePreview: () => {
      if (previewUrl) {
        revokeFilePreview(previewUrl);
        setPreviewUrl(null);
      }
    }
  };
};
