import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { checkExportLimit } from '@/utils/eroboardPdfExporter';

export const useExportLimit = () => {
  const { session } = useAuth();
  const [canExport, setCanExport] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportLimit] = useState(3);
  const [loading, setLoading] = useState(true);

  const checkLimit = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const result = await checkExportLimit(session.user.id);
      setCanExport(result.canExport);
      setExportCount(result.count);
    } catch (error) {
      console.error('Error checking export limit:', error);
      setCanExport(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLimit();
  }, [session?.user?.id]);

  const refreshLimit = () => {
    checkLimit();
  };

  return {
    canExport,
    exportCount,
    exportLimit,
    remainingExports: exportLimit - exportCount,
    loading,
    refreshLimit
  };
};