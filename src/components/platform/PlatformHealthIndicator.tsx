import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Activity, Wifi, WifiOff } from 'lucide-react';
import { usePlatformHealth } from '@/hooks/usePlatformHealth';
import { cn } from '@/lib/utils';

export const PlatformHealthIndicator = () => {
  const { health, isChecking, isHealthy, isDegraded, isDown } = usePlatformHealth();

  const getStatusIcon = () => {
    if (isDown) return <WifiOff className="w-4 h-4" />;
    if (isDegraded) return <AlertTriangle className="w-4 h-4" />;
    if (isHealthy) return <CheckCircle className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (isDown) return 'text-red-400 border-red-400/50 bg-red-500/10';
    if (isDegraded) return 'text-yellow-400 border-yellow-400/50 bg-yellow-500/10';
    if (isHealthy) return 'text-green-400 border-green-400/50 bg-green-500/10';
    return 'text-blue-400 border-blue-400/50 bg-blue-500/10';
  };

  const getStatusText = () => {
    if (isDown) return 'System Issues';
    if (isDegraded) return 'Degraded Performance';
    if (isHealthy) return 'All Systems Operational';
    return 'Checking...';
  };

  // Only show if there are issues or checking
  if (isHealthy && !isChecking) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          'fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm',
          getStatusColor()
        )}
      >
        <motion.div
          animate={isChecking ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          {getStatusIcon()}
        </motion.div>
        
        <span className="text-sm font-medium">
          {getStatusText()}
        </span>

        {health.errors.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-current rounded-full"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};