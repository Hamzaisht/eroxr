
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, ReactNode } from "react";
import { initializeScreenshotProtection } from "@/lib/security";

interface ProtectedMediaProps {
  children: ReactNode;
  contentOwnerId: string;
  className?: string;
}

export const ProtectedMedia: React.FC<ProtectedMediaProps> = ({ 
  children, 
  contentOwnerId,
  className 
}) => {
  const session = useSession();
  
  useEffect(() => {
    if (session?.user?.id && contentOwnerId) {
      // Only initialize protection if the viewer is different from the content owner
      if (session.user.id !== contentOwnerId) {
        initializeScreenshotProtection(session.user.id, contentOwnerId);
      }
    }
  }, [session, contentOwnerId]);
  
  return (
    <div 
      className={className} 
      style={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        userSelect: 'none',
        pointerEvents: 'auto',
        touchAction: 'manipulation',
        position: 'relative'
      }}
      onContextMenu={e => e.preventDefault()}
    >
      {children}
    </div>
  );
};
