
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { 
  getUserMediaAssets, 
  getUserMediaByType, 
  deleteMediaAsset, 
  MediaAsset 
} from '@/services/mediaAssetsService';
import { useToast } from './use-toast';

export const useMediaAssets = (type?: 'image' | 'video' | 'audio' | 'document') => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();

  const fetchAssets = async () => {
    if (!session?.user) {
      setAssets([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = type 
        ? await getUserMediaByType(type)
        : await getUserMediaAssets();

      if (fetchError) {
        throw fetchError;
      }

      setAssets(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch media assets');
      console.error('Error fetching media assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [session?.user?.id, type]);

  const deleteAsset = async (id: string) => {
    try {
      const { success, error: deleteError } = await deleteMediaAsset(id);

      if (deleteError) {
        throw deleteError;
      }

      if (success) {
        setAssets((prev) => prev.filter((asset) => asset.id !== id));
        toast({
          title: 'Media deleted',
          description: 'The media asset was successfully deleted.',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Delete failed',
        description: err.message || 'Failed to delete media asset',
        variant: 'destructive',
      });
    }
  };

  const refreshAssets = () => {
    fetchAssets();
  };

  return {
    assets,
    isLoading,
    error,
    deleteAsset,
    refreshAssets
  };
};
