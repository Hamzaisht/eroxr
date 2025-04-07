
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useGhostMode } from "@/hooks/useGhostMode";

interface ProtectedMediaProps {
  children: React.ReactNode;
  contentOwnerId: string;
  className?: string;
}

export const ProtectedMedia = ({ children, contentOwnerId, className = "" }: ProtectedMediaProps) => {
  const session = useSession();
  const { isGhostMode } = useGhostMode();

  useEffect(() => {
    // Don't log ghost mode views
    if (isGhostMode) return;
    
    // Add screenshot protection
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Potential screenshot detected
        if (session?.user?.id && contentOwnerId) {
          supabase.from('security_violations').insert({
            violator_id: session.user.id,
            content_owner_id: contentOwnerId,
            violation_type: 'screenshot'
          }).then(() => {
            console.log('Screenshot attempt logged');
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session?.user?.id, contentOwnerId, isGhostMode]);

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        pointerEvents: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
      <div className="absolute inset-0 bg-transparent" />
    </div>
  );
};
