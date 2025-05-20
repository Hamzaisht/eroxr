
import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedMarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'shield' | 'checkmark';
}

export const VerifiedMark: React.FC<VerifiedMarkProps> = ({ 
  className, 
  size = 'md', 
  variant = 'shield' 
}) => {
  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center text-blue-500",
      className
    )}>
      {variant === 'shield' ? (
        <Shield className={cn(iconSize[size])} />
      ) : (
        <CheckCircle className={cn(iconSize[size])} />
      )}
    </span>
  );
};

export default VerifiedMark;
