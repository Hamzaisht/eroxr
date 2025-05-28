
import { useState } from 'react';

export const useMediaRenderer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [failedAssets, setFailedAssets] = useState<Set<string>>(new Set());

  const handleError = (assetId?: string, storagePath?: string, onError?: () => void) => {
    console.error('MediaRenderer - Media failed to load:', { assetId, storagePath });
    setHasError(true);
    setIsLoading(false);
    
    if (assetId) {
      setFailedAssets(prev => new Set([...prev, assetId]));
    }
    
    onError?.();
  };

  const handleLoad = () => {
    console.log('MediaRenderer - Media loaded successfully');
    setIsLoading(false);
    setHasError(false);
  };

  const getMediaUrl = (storagePath: string) => {
    if (!storagePath) {
      console.error("MediaRenderer - Empty storage path");
      return '';
    }
    
    const cleanPath = storagePath.replace(/^\/+/, '');
    const url = `https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/media/${cleanPath}`;
    console.log("MediaRenderer - Built media URL:", { storagePath, cleanPath, url });
    return url;
  };

  const getMediaType = (mediaType: string): 'image' | 'video' | 'audio' => {
    console.log("MediaRenderer - Determining media type for:", mediaType);
    
    if (mediaType === 'video' || mediaType.startsWith('video/')) return 'video';
    if (mediaType === 'image' || mediaType.startsWith('image/')) return 'image';
    if (mediaType === 'audio' || mediaType.startsWith('audio/')) return 'audio';
    
    console.warn("MediaRenderer - Unknown media type, defaulting to image:", mediaType);
    return 'image';
  };

  return {
    isLoading,
    hasError,
    isMuted,
    failedAssets,
    setIsMuted,
    handleError,
    handleLoad,
    getMediaUrl,
    getMediaType
  };
};
