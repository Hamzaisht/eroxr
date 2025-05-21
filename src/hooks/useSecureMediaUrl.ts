
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MediaAccessLevel } from '@/utils/media/types';

interface UseSecureMediaUrlProps {
  url?: string;
  path?: string;
  accessLevel?: MediaAccessLevel;
  expiryMinutes?: number;
}

export function useSecureMediaUrl({
  url,
  path,
  accessLevel = MediaAccessLevel.PUBLIC,
  expiryMinutes = 30
}: UseSecureMediaUrlProps) {
  const [secureUrl, setSecureUrl] = useState<string | null>(url || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Extract storage path from URL if path is not provided
  const getPathFromUrl = (url?: string): string | null => {
    if (!url) return null;
    
    const match = url.match(/\/storage\/v1\/object\/public\/([^?]+)/);
    return match ? match[1] : null;
  };
  
  const storagePath = path || getPathFromUrl(url);
  
  const refreshUrl = async () => {
    if (!storagePath) {
      setError('No valid storage path found');
      return url;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For public content, use public URL
      if (accessLevel === MediaAccessLevel.PUBLIC) {
        const { data } = supabase.storage
          .from("media")
          .getPublicUrl(storagePath);
        
        setSecureUrl(data.publicUrl);
        return data.publicUrl;
      } 
      
      // For non-public content, use signed URLs
      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(storagePath, expiryMinutes * 60);
        
      if (error || !data?.signedUrl) {
        throw new Error(error?.message || 'Failed to create signed URL');
      }
      
      setSecureUrl(data.signedUrl);
      return data.signedUrl;
    } catch (err: any) {
      console.error("Error generating secure media URL:", err);
      setError(err.message || 'Unknown error');
      
      // Fall back to the original URL
      return url;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh the URL on initial mount
  useEffect(() => {
    if ((accessLevel !== MediaAccessLevel.PUBLIC) && storagePath) {
      refreshUrl();
    } else if (url) {
      setSecureUrl(url);
    }
  }, [accessLevel, storagePath, url]);
  
  return {
    url: secureUrl,
    isLoading,
    error,
    refreshUrl
  };
}
