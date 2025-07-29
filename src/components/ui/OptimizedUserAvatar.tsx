import React, { memo, useMemo } from 'react';
import { useOptimizedUserData } from '@/hooks/useOptimizedUserData';
import { motion } from 'framer-motion';
import { Crown, Star, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedUserAvatarProps {
  userId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  showRole?: boolean;
}

export const OptimizedUserAvatar = memo(({ 
  userId, 
  className = '', 
  size = 'md', 
  showStatus = false,
  showRole = false 
}: OptimizedUserAvatarProps) => {
  const { profile, role, isSuperAdmin, isAdmin } = useOptimizedUserData();
  
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  }, [size]);

  const roleIcon = useMemo(() => {
    if (!showRole) return null;
    if (isSuperAdmin) return <Crown className="w-3 h-3 text-yellow-400" />;
    if (isAdmin) return <Shield className="w-3 h-3 text-blue-400" />;
    return <Star className="w-3 h-3 text-gray-400" />;
  }, [showRole, isSuperAdmin, isAdmin]);

  const avatarUrl = profile?.avatar_url;

  return (
    <div className={cn('relative', className)}>
      <motion.div
        className={cn(
          'rounded-full overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 border border-white/10',
          sizeClasses
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/60">
            {profile?.username?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </motion.div>
      
      {showStatus && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
      )}
      
      {roleIcon && (
        <div className="absolute -top-1 -right-1 p-1 bg-black/80 rounded-full">
          {roleIcon}
        </div>
      )}
    </div>
  );
});

OptimizedUserAvatar.displayName = 'OptimizedUserAvatar';