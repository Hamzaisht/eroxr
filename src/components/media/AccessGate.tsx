
import { ReactNode } from 'react';
import { useContentAccess } from '@/hooks/useContentAccess';
import { AccessControlOverlay } from './AccessControlOverlay';
import { MediaAccessLevel } from '@/utils/media/types';
import { Loader2 } from 'lucide-react';

interface AccessGateProps {
  children: ReactNode;
  creatorId: string;
  creatorHandle?: string;
  contentId?: string;
  accessLevel: MediaAccessLevel;
  ppvAmount?: number;
  className?: string;
}

export const AccessGate = ({
  children,
  creatorId,
  creatorHandle,
  contentId,
  accessLevel,
  ppvAmount,
  className = ""
}: AccessGateProps) => {
  const {
    canAccess,
    isLoading,
    reason,
    actionText,
    actions
  } = useContentAccess({
    creatorId,
    contentId,
    accessLevel,
    ppvAmount
  });

  if (isLoading) {
    return (
      <div className={`relative flex items-center justify-center bg-gray-900 ${className}`}>
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className={`relative ${className}`}>
        {children}
        <AccessControlOverlay
          accessLevel={accessLevel}
          creatorHandle={creatorHandle}
          ppvAmount={ppvAmount}
          reason={reason}
          actionText={actionText}
          onSubscribe={actions.subscribe}
          onPurchase={actions.purchase}
          onFollow={actions.follow}
        />
      </div>
    );
  }

  return <>{children}</>;
};
