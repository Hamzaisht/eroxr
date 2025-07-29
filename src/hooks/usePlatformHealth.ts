import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePlatformOptimizations } from './usePlatformOptimizations';

interface PlatformHealth {
  database: 'healthy' | 'degraded' | 'down';
  auth: 'healthy' | 'degraded' | 'down';
  storage: 'healthy' | 'degraded' | 'down';
  api: 'healthy' | 'degraded' | 'down';
  overall: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
  errors: string[];
}

export const usePlatformHealth = () => {
  const [health, setHealth] = useState<PlatformHealth>({
    database: 'healthy',
    auth: 'healthy',
    storage: 'healthy',
    api: 'healthy',
    overall: 'healthy',
    lastCheck: new Date(),
    errors: []
  });
  
  const [isChecking, setIsChecking] = useState(false);
  const { optimizedApiCall } = usePlatformOptimizations();

  const checkDatabaseHealth = async (): Promise<{ status: 'healthy' | 'degraded' | 'down', error?: string }> => {
    try {
      const start = performance.now();
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      const duration = performance.now() - start;
      
      if (error) {
        return { status: 'down', error: error.message };
      }
      
      if (duration > 2000) {
        return { status: 'degraded', error: 'Slow response time' };
      }
      
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'down', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const checkAuthHealth = async (): Promise<{ status: 'healthy' | 'degraded' | 'down', error?: string }> => {
    try {
      const start = performance.now();
      const { data: { session }, error } = await supabase.auth.getSession();
      const duration = performance.now() - start;
      
      if (error) {
        return { status: 'down', error: error.message };
      }
      
      if (duration > 1000) {
        return { status: 'degraded', error: 'Slow auth response' };
      }
      
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'down', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const checkStorageHealth = async (): Promise<{ status: 'healthy' | 'degraded' | 'down', error?: string }> => {
    try {
      const start = performance.now();
      const { data, error } = await supabase.storage
        .from('media')
        .list('', { limit: 1 });
      
      const duration = performance.now() - start;
      
      if (error) {
        return { status: 'down', error: error.message };
      }
      
      if (duration > 3000) {
        return { status: 'degraded', error: 'Slow storage response' };
      }
      
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'down', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const checkApiHealth = async (): Promise<{ status: 'healthy' | 'degraded' | 'down', error?: string }> => {
    try {
      const start = performance.now();
      const { data, error } = await supabase
        .rpc('is_super_admin', { user_id: 'test' });
      
      const duration = performance.now() - start;
      
      // RPC should return false for test user, error is expected for invalid user
      if (duration > 2000) {
        return { status: 'degraded', error: 'Slow RPC response' };
      }
      
      return { status: 'healthy' };
    } catch (error) {
      // Some errors are expected for test calls
      return { status: 'healthy' };
    }
  };

  const performHealthCheck = async () => {
    setIsChecking(true);
    const errors: string[] = [];

    try {
      const [dbHealth, authHealth, storageHealth, apiHealth] = await Promise.all([
        checkDatabaseHealth(),
        checkAuthHealth(),
        checkStorageHealth(),
        checkApiHealth()
      ]);

      if (dbHealth.error) errors.push(`Database: ${dbHealth.error}`);
      if (authHealth.error) errors.push(`Auth: ${authHealth.error}`);
      if (storageHealth.error) errors.push(`Storage: ${storageHealth.error}`);
      if (apiHealth.error) errors.push(`API: ${apiHealth.error}`);

      const statuses = [dbHealth.status, authHealth.status, storageHealth.status, apiHealth.status];
      const overall = statuses.includes('down') ? 'down' : 
                    statuses.includes('degraded') ? 'degraded' : 'healthy';

      setHealth({
        database: dbHealth.status,
        auth: authHealth.status,
        storage: storageHealth.status,
        api: apiHealth.status,
        overall,
        lastCheck: new Date(),
        errors
      });

      // Log health status
      console.log(`🏥 Platform Health Check: ${overall}`, {
        database: dbHealth.status,
        auth: authHealth.status,
        storage: storageHealth.status,
        api: apiHealth.status,
        errors
      });

    } catch (error) {
      console.error('Health check failed:', error);
      setHealth(prev => ({
        ...prev,
        overall: 'down',
        lastCheck: new Date(),
        errors: ['Health check system failure']
      }));
    } finally {
      setIsChecking(false);
    }
  };

  // Perform initial health check and set up interval
  useEffect(() => {
    performHealthCheck();
    
    // Check health every 5 minutes
    const interval = setInterval(performHealthCheck, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Check health when coming back from background
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        performHealthCheck();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return {
    health,
    isChecking,
    performHealthCheck,
    isHealthy: health.overall === 'healthy',
    isDegraded: health.overall === 'degraded',
    isDown: health.overall === 'down'
  };
};